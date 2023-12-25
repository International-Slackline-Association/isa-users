import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from 'core/aws/clients';
import { DDBUserOrganizationAttrs, DDBUserOrganizationItem } from 'core/db/user/organizations/types';
import { composeKey, destructKey, INDEX_NAMES, TABLE_NAME, transformUtils } from 'core/db/utils';

const { attrsToItem, itemToAttrs, keyFields, keyUtils, key } = transformUtils<
  DDBUserOrganizationItem,
  DDBUserOrganizationAttrs
>({
  PK: {
    fields: ['userId'],
    compose: (params) => composeKey('user', params.userId),
    destruct: (key) => ({
      userId: destructKey(key, 1),
    }),
  },
  SK_GSI: {
    fields: ['organizationId'],
    compose: (params) => composeKey('org', params.organizationId),
    destruct: (key) => ({
      organizationId: destructKey(key, 1),
    }),
  },
  GSI_SK: {
    compose: () => 'details',
  },
});

export const getOrganizationsOfUser = async (userId: string) => {
  return ddb
    .send(
      new QueryCommand({
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
      }),
    )
    .then((data) => {
      const items = data.Items || [];
      return items.map((i: DDBUserOrganizationAttrs) => attrsToItem(i));
    });
};

export const getUsersOfOrganization = async (organizationId: string) => {
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
          ':SK_GSI': keyUtils.SK_GSI.compose({ organizationId }),
        },
      }),
    )
    .then((data) => {
      const items = data.Items || [];
      return items.map((i: DDBUserOrganizationAttrs) => attrsToItem(i));
    });
};

export const getUserOrganization = async (userId: string, organizationId: string) => {
  return ddb
    .send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: key({ userId, organizationId }),
      }),
    )
    .then((data) => {
      if (data.Item) {
        return attrsToItem(data.Item as DDBUserOrganizationAttrs);
      }
      return null;
    });
};

export const putUserOrganization = async (organization: DDBUserOrganizationItem) => {
  return ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: itemToAttrs(organization) }));
};

export const updateUserOrganization = async (organization: DDBUserOrganizationItem) => {
  return ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: itemToAttrs(organization) }));
};

export async function updateOrganizationField<T extends keyof DDBUserOrganizationItem>(
  organizationId: string,
  userId: string,
  field: T,
  value: DDBUserOrganizationItem[T],
) {
  return ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: key({ userId, organizationId }),
      UpdateExpression: `SET #field = :v`,
      ExpressionAttributeNames: {
        '#field': field,
      },
      ExpressionAttributeValues: {
        ':v': value,
      },
    }),
  );
}

export const removeUserOrganization = async (userId: string, organizationId: string) => {
  return ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: key({ organizationId, userId }) }));
};
