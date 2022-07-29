import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBClubAttrs, DDBClubItem } from 'core/db/club/types';
import { composeKey, destructKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs, keyFields, keyUtils } = transformUtils<DDBClubItem, DDBClubAttrs>({
  PK: {
    fields: ['clubId'],
    compose: (params) => composeKey('club', params.clubId),
    destruct: (key) => ({
      clubId: destructKey(key, 1),
    }),
  },
  SK_GSI: {
    compose: () => 'clubDetails',
  },

  GSI_SK: {
    fields: ['email'],
    compose: (params) => composeKey('email', params.email),
    destruct: (key) => ({
      email: destructKey(key, 1),
    }),
  },
});

export const getAllClubs = async () => {
  return ddb
    .query({
      TableName: TABLE_NAME,
      IndexName: INDEX_NAMES.GSI,
      KeyConditionExpression: '#SK_GSI = :SK_GSI',
      ExpressionAttributeNames: {
        '#SK_GSI': keyFields.SK_GSI,
      },
      ExpressionAttributeValues: {
        ':SK_GSI': keyUtils.SK_GSI.compose({}),
      },
    })
    .promise()
    .then((data) => {
      const items = data.Items || [];
      return items.map((i: DDBClubAttrs) => attrsToItem(i));
    });
};

export const getClub = async (clubId: string) => {
  return ddb
    .get({ TableName: TABLE_NAME, Key: key({ clubId }) })
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBClubAttrs);
      }
      return null;
    });
};

export const getClubs = async (clubIds: string[]) => {
  return ddb
    .batchGet({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: clubIds.map((id) => key({ clubId: id })),
        },
      },
    })
    .promise()
    .then((data) => {
      const items = data.Responses[TABLE_NAME] || [];
      return items.map((i: DDBClubAttrs) => attrsToItem(i));
    });
};

export const putClub = async (club: DDBClubItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(club) }).promise();
};
