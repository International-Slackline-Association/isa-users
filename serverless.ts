import type { AWS } from '@serverless/typescript';

import api from '@functions/api';
import apiCustomScopes from '@functions/api/scopedLambda';
import cognitoTrigger from '@functions/cognito';
import logger from '@functions/logger';
import verificationApi from '@functions/verification-api';
import publicApi from '@functions/public-api';

import { dynamodbResources } from 'infrastructure/dynamodb';
import { cloudwatchResources } from 'infrastructure/cloudwatch';
import { backupResources } from 'infrastructure/backup';

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
          {
            Effect: 'Allow',
            Action: ['ssm:GetParameters', 'ssm:GetParameter', 'ssm:GetParametersByPath'],
            Resource: 'arn:aws:ssm:${aws:region}:${aws:accountId}:parameter/isa-users*',
          },
          {
            Effect: 'Allow',
            Action: ['ses:VerifyEmailIdentity', 'ses:SendEmail'],
            Resource: '*',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { api, cognitoTrigger, logger, verificationApi, publicApi, apiCustomScopes },
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
      ...dynamodbResources,
      ...cloudwatchResources,
      ...backupResources,
    },
  },
};

module.exports = serverlessConfiguration;
