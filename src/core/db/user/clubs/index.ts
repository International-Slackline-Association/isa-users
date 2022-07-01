import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBUserClubAttrs, DDBUserClubItem } from 'core/db/user/clubs/types';
import { composeKey, destructKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { attrsToItem, itemToAttrs, keyFields, keyUtils, key } = transformUtils<DDBUserClubItem, DDBUserClubAttrs>({
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
  GSI_SK: {
    compose: () => 'details',
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

export const getUserClub = async (userId: string, clubId: string) => {
  return ddb
    .get({
      TableName: TABLE_NAME,
      Key: key({ userId, clubId }),
    })
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBUserClubAttrs);
      }
      return null;
    });
};

export const putUserClub = async (club: DDBUserClubItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(club) }).promise();
};

export const updateUserClub = async (club: DDBUserClubItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(club) }).promise();
};

export async function updateClubField<T extends keyof DDBUserClubItem>(
  clubId: string,
  userId: string,
  field: T,
  value: DDBUserClubItem[T],
) {
  const params: DocumentClient.UpdateItemInput = {
    TableName: TABLE_NAME,
    Key: key({ userId, clubId }),
    UpdateExpression: `SET #field = :v`,
    ExpressionAttributeNames: {
      '#field': field,
    },
    ExpressionAttributeValues: {
      ':v': value,
    },
  };
  return ddb.update(params).promise();
}

export const removeUserClub = async (userId: string, clubId: string) => {
  return ddb.delete({ TableName: TABLE_NAME, Key: key({ clubId, userId }) }).promise();
};
