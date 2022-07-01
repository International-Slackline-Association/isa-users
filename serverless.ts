import type { AWS } from '@serverless/typescript';

import api from '@functions/api';
import cognitoTrigger from '@functions/cognito';
import logger from '@functions/logger';

const serverlessConfiguration: AWS = {
  service: 'isa-users',
  frameworkVersion: '3',
  plugins: ['serverless-plugin-log-subscription', 'serverless-esbuild', 'serverless-prune-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-central-1',
    stage: 'prod',
    profile: 'ISA_Can',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ISA_USERS_TABLE: { Ref: 'UsersTable' },
      APPLICATION_LOG_GROUP_NAME: { Ref: 'CloudWatchApplicationLogs' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: [
              {
                'Fn::Join': ['', [{ 'Fn::GetAtt': ['UsersTable', 'Arn'] }, '*']],
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: ['logs:*'],
            Resource: [
              {
                'Fn::GetAtt': ['CloudWatchApplicationLogs', 'Arn'],
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: ['cognito-idp:AdminUpdateUserAttributes'],
            Resource: ['${ssm:isa-users-cognitoPoolArn}'],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { api, cognitoTrigger, logger },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    prune: {
      automatic: true,
      number: 5,
    },
    logSubscription: {
      enabled: true,
      filterPattern: '{ $.level = "*" && $.message = "*" }',
      destinationArn: {
        'Fn::GetAtt': ['LoggerLambdaFunction', 'Arn'],
      },
    },
  },
  resources: {
    Resources: {
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
              AttributeName: 'GSI_SK',
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
              IndexName: 'PK-LSI',
              KeySchema: [
                { AttributeName: 'PK', KeyType: 'HASH' },
                { AttributeName: 'LSI', KeyType: 'RANGE' },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'GSI-GSI_SK',
              KeySchema: [
                { AttributeName: 'SK_GSI', KeyType: 'HASH' },
                { AttributeName: 'GSI_SK', KeyType: 'RANGE' },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      CloudWatchApplicationLogs: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          LogGroupName: 'isa-users/ApplicationLogs',
          RetentionInDays: 90,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
