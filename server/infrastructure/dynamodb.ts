import type { AWS } from '@serverless/typescript';

export const dynamodbResources: NonNullable<AWS['resources']>['Resources'] = {
  UsersTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: 'isa-users',
      AttributeDefinitions: [
        {
          AttributeName: 'PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'SK_GSI',
          AttributeType: 'S',
        },
        {
          AttributeName: 'LSI',
          AttributeType: 'S',
        },
        {
          AttributeName: 'LSI2',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI_SK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI2',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI2_SK',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'SK_GSI',
          KeyType: 'RANGE',
        },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'LSI',
          KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' },
            { AttributeName: 'LSI', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'LSI2',
          KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' },
            { AttributeName: 'LSI2', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI',
          KeySchema: [
            { AttributeName: 'SK_GSI', KeyType: 'HASH' },
            { AttributeName: 'GSI_SK', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'GSI2',
          KeySchema: [
            { AttributeName: 'GSI2', KeyType: 'HASH' },
            { AttributeName: 'GSI2_SK', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      TimeToLiveSpecification: {
        AttributeName: 'ddb_ttl',
        Enabled: 'TRUE',
      },
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
      DeletionProtectionEnabled: true,
      Tags: [
        {
          Key: 'aws_backup',
          Value: 'isa_users_default_backup-${sls:stage}',
        },
      ],
    },
  },
};
