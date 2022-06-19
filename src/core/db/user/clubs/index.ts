import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBUserClubAttrs, DDBUserClubItem } from 'core/db/user/clubs/types';
import { composeKey, destructKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { attrsToItem, itemToAttrs, keyFields, keyUtils } = transformUtils<DDBUserClubItem, DDBUserClubAttrs>({
  PK: {
    fields: ['userId'],
    compose: (params) => composeKey('user', params.userId),
    destruct: (key) => ({
      userId: destructKey(key, 1),
    }),
  },
  SK_GSI: {
    fields: ['clubId'],
    compose: (params) => composeKey('club', params.clubId),
    destruct: (key) => ({
      clubId: destructKey(key, 1),
    }),
  },
});

export const getClubsOfUser = async (userId: string) => {
  return ddb
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: '#PK = :PK and begins_with(#SK_GSI, :sortKeyPrefix)',
      ExpressionAttributeNames: {
        '#PK': keyFields.PK,
        '#SK_GSI': keyFields.SK_GSI,
      },
      ExpressionAttributeValues: {
        ':PK': keyUtils.PK.compose({ userId }),
        ':sortKeyPrefix': keyUtils.SK_GSI.compose({}),
      },
    })
    .promise()
    .then((data) => {
      const items = data.Items || [];
      return items.map((i: DDBUserClubAttrs) => attrsToItem(i));
    });
};

export const getUsersOfClub = async (clubId: string) => {
  return ddb
    .query({
      TableName: TABLE_NAME,
      IndexName: INDEX_NAMES.GSI,
      KeyConditionExpression: '#SK_GSI = :SK_GSI',
      ExpressionAttributeNames: {
        '#SK_GSI': keyFields.SK_GSI,
      },
      ExpressionAttributeValues: {
        ':SK_GSI': keyUtils.SK_GSI.compose({ clubId }),
      },
    })
    .promise()
    .then((data) => {
      const items = data.Items || [];
      return items.map((i: DDBUserClubAttrs) => attrsToItem(i));
    });
};

export const putUserClub = async (club: DDBUserClubItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(club) }).promise();
};
