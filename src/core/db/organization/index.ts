import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBOrganizationAttrs, DDBOrganizationItem } from 'core/db/organization/types';
import { composeKey, destructKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { key, attrsToItem, itemToAttrs, keyFields, keyUtils } = transformUtils<
  DDBOrganizationItem,
  DDBOrganizationAttrs
>({
  PK: {
    fields: ['organizationId'],
    compose: (params) => composeKey('org', params.organizationId),
    destruct: (key) => ({
      organizationId: destructKey(key, 1),
    }),
  },
  SK_GSI: {
    compose: () => 'orgDetails',
  },

  GSI_SK: {
    fields: ['email'],
    compose: (params) => composeKey('email', params.email),
    destruct: (key) => ({
      email: destructKey(key, 1),
    }),
  },
});

export const getAllOrganizations = async () => {
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
      return items.map((i: DDBOrganizationAttrs) => attrsToItem(i));
    });
};

export const getOrganization = async (organizationId: string) => {
  return ddb
    .get({ TableName: TABLE_NAME, Key: key({ organizationId: organizationId }) })
    .promise()
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBOrganizationAttrs);
      }
      return null;
    });
};

export const getOrganizations = async (organizationIds: string[]) => {
  return ddb
    .batchGet({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: organizationIds.map((id) => key({ organizationId: id })),
        },
      },
    })
    .promise()
    .then((data) => {
      const items = data.Responses[TABLE_NAME] || [];
      return items.map((i: DDBOrganizationAttrs) => attrsToItem(i));
    });
};

export const putOrganization = async (organization: DDBOrganizationItem) => {
  return ddb.put({ TableName: TABLE_NAME, Item: itemToAttrs(organization) }).promise();
};
