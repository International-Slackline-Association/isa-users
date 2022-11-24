import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBGenericHasAttrs, DDBGenericHashItem } from 'core/db/genericHash/types';
import { composeKey, destructKey, TABLE_NAME, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs } = transformUtils<DDBGenericHashItem, DDBGenericHasAttrs>({
  PK: {
    fields: [],
    compose: () => 'genericHashes',
  },
  SK_GSI: {
    fields: ['hash'],
    compose: (param) => param.hash,
    destruct: (key) => ({
      hash: key,
    }),
  },
});

export const getHash = async (hash: string) => {
  return ddb
    .get({ TableName: TABLE_NAME, Key: key({ hash }) })
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBGenericHasAttrs);
      }
      return null;
    });
};

export const putHash = async (hash: DDBGenericHashItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(hash) }).promise();
};
