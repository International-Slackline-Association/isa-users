import type { AWS } from '@serverless/typescript';

import api from '@functions/api';
import cognitoTrigger from '@functions/cognito';
import logger from '@functions/logger';
import verificationApi from '@functions/verification-api';
import publicApi from '@functions/public-api';
import migrations from '@functions/migrations';

import { dynamodbResources } from 'infrastructure/dynamodb';
import { cloudwatchResources } from 'infrastructure/cloudwatch';
import { backupResources } from 'infrastructure/backup';
import { s3Resources } from 'infrastructure/s3';

const serverlessConfiguration: AWS = {
  service: 'isa-users',
  frameworkVersion: '3',
  plugins: ['serverless-plugin-log-subscription', 'serverless-esbuild', 'serverless-prune-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'eu-central-1',
    stage: 'prod',
    profile: '${env:AWS_PROFILE}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ISA_USERS_TABLE: { Ref: 'UsersTable' },
      APPLICATION_LOG_GROUP_NAME: { Ref: 'CloudWatchApplicationLogs' },
      ISA_DOCUMENTS_IMAGE_PROCESSING_API_KEY: '${ssm:/isa-documents-trusted-service-api-key}',
      ISA_USERS_IMAGES_S3_BUCKET: { Ref: 'IsaUsersImagesS3Bucket' },
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
            Resource: [
              'arn:aws:ssm:${aws:region}:${aws:accountId}:parameter/isa-users*',
              'arn:aws:ssm:${aws:region}:${aws:accountId}:parameter/isa-documents*',
            ],
          },
          {
            Effect: 'Allow',
            Action: ['ses:VerifyEmailIdentity', 'ses:SendEmail'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: [
              {
                'Fn::Join': ['', [{ 'Fn::GetAtt': ['IsaUsersImagesS3Bucket', 'Arn'] }, '*']],
              },
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { api, cognitoTrigger, logger, verificationApi, publicApi, migrations },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
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
      ...s3Resources,
    },
    Outputs: {
      UsersTable: {
        Value: {
          Ref: 'UsersTable',
        },
        Export: {
          Name: 'UsersTable-Name',
        },
      },
      UsersTableArn: {
        Value: {
          'Fn::GetAtt': ['UsersTable', 'Arn'],
        },
        Export: {
          Name: 'UsersTable-Arn',
        },
      },
      ISAUsersImagesS3BucketArn: {
        Value: {
          'Fn::GetAtt': ['IsaUsersImagesS3Bucket', 'Arn'],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
