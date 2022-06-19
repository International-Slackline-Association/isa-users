import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBUserDetailAttrs, DDBUserDetailItem } from 'core/db/user/details/types';
import { composeKey, destructKey, TABLE_NAME, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs } = transformUtils<DDBUserDetailItem, DDBUserDetailAttrs>({
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
        TABLE_NAME: {
          Keys: userIds.map((id) => key({ userId: id })),
        },
      },
    })
    .promise()
    .then((data) => {
      const items = data.Responses?.TABLE_NAME || [];
      return items.map((i: DDBUserDetailAttrs) => attrsToItem(i));
    });
};

export const putUser = async (user: DDBUserDetailItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(user) }).promise();
};
