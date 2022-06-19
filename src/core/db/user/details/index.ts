import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBUserDetailAttrs, DDBUserDetailItem } from 'core/db/user/details/types';
import { compositeKey, destructKey, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs } = transformUtils<DDBUserDetailItem, DDBUserDetailAttrs>({
  PK: {
    fields: ['email'],
    compose: (params) => compositeKey('user', params.email),
    destruct: (key) => ({
      email: destructKey(key, 1),
    }),
  },
  SK_GSI: {
    compose: () => 'user',
  },
});

export const getUser = async (email: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: '',
    Key: key({ email }),
  };
  return ddb
    .get(params)
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBUserDetailAttrs);
      }
      return null;
    });
};

export const putUser = async (user: DDBUserDetailItem) => {
  const params: DocumentClient.PutItemInput = {
    TableName: '',
    Item: itemToAttrs(user),
  };
  return ddb.put(params).promise();
};
