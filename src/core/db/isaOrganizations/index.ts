import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBISAOrganizationAttrs, DDBISAOrganizationItem } from 'core/db/isaOrganizations/types';
import { composeKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs, keyFields, keyUtils } = transformUtils<
  DDBISAOrganizationItem,
  DDBISAOrganizationAttrs
>({
  PK: {
    compose: () => 'isaMembers',
  },
  SK_GSI: {
    fields: ['email'],
    compose: (params) => composeKey('member', params.email),
  },
});

export const getISAOrganization = async (email: string) => {
  return ddb
    .get({ TableName: TABLE_NAME, Key: key({ email }) })
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBISAOrganizationAttrs);
      }
      return null;
    });
};
