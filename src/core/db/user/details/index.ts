import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBUserDetailAttrs, DDBUserDetailItem } from 'core/db/user/details/types';
import { composeKey, destructKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs, keyFields, keyUtils } = transformUtils<DDBUserDetailItem, DDBUserDetailAttrs>({
  PK: {
    fields: ['userId'],
    compose: (params) => composeKey('user', params.userId),
    destruct: (key) => ({
      userId: destructKey(key, 1),
    }),
  },
  SK_GSI: {
    compose: () => 'userDetails',
  },
  GSI_SK: {
    fields: ['email'],
    compose: (params) => composeKey('email', params.email),
    destruct: (key) => ({
      email: destructKey(key, 1),
    }),
  },
});

export const getUser = async (userId: string) => {
  return ddb
    .get({ TableName: TABLE_NAME, Key: key({ userId }) })
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBUserDetailAttrs);
      }
      return null;
    });
};

export const getUsers = async (userIds: string[]) => {
  return ddb
    .batchGet({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: userIds.map((id) => key({ userId: id })),
        },
      },
    })
    .promise()
    .then((data) => {
      const items = data.Responses?.[TABLE_NAME] || [];
      return items.map((i: DDBUserDetailAttrs) => attrsToItem(i));
    });
};

export const getAllUsers = async () => {
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
      return items.map((i: DDBUserDetailAttrs) => attrsToItem(i));
    });
};

export const putUser = async (user: DDBUserDetailItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(user) }).promise();
};
