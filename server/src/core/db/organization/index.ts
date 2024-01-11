import { BatchGetCommand, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBOrganizationAttrs, DDBOrganizationItem } from 'core/db/organization/types';
import { INDEX_NAMES, TABLE_NAME, composeKey, destructKey, transformUtils } from 'core/db/utils';

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
    .send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAMES.GSI,
        KeyConditionExpression: '#SK_GSI = :SK_GSI',
        ExpressionAttributeNames: {
          '#SK_GSI': keyFields.SK_GSI,
        },
        ExpressionAttributeValues: {
          ':SK_GSI': keyUtils.SK_GSI.compose({}),
        },
      }),
    )
    .then((data) => {
      const items = data.Items || [];
      return items.map((i: DDBOrganizationAttrs) => attrsToItem(i));
    });
};

export const getOrganization = async (organizationId: string) => {
  return ddb
    .send(new GetCommand({ TableName: TABLE_NAME, Key: key({ organizationId: organizationId }) }))
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBOrganizationAttrs);
      }
      return null;
    });
};

export const getOrganizations = async (organizationIds: string[]) => {
  return ddb
    .send(
      new BatchGetCommand({
        RequestItems: {
          [TABLE_NAME]: {
            Keys: organizationIds.map((id) => key({ organizationId: id })),
          },
        },
      }),
    )
    .then((data) => {
      const items = data.Responses[TABLE_NAME] || [];
      return items.map((i: DDBOrganizationAttrs) => attrsToItem(i));
    });
};

export const putOrganization = async (organization: DDBOrganizationItem) => {
  return ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: itemToAttrs(organization) }));
};
