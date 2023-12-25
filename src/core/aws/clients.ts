import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SSMClient } from '@aws-sdk/client-ssm';
import { SESClient } from '@aws-sdk/client-ses';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from 'core/logger';

const dynamoDB = new DynamoDBClient({});

export const ddb = DynamoDBDocumentClient.from(dynamoDB, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});
ddb.middlewareStack.add(
  (next, context) => async (args) => {
    try {
      return await next(args);
    } catch (error) {
      logger.error(`DynamoDB Error`, {
        command: context.commandName || args.constructor.name,
        input: args.input,
        error: (error as any).message,
      });
      throw error;
    }
  },
  {
    step: 'initialize',
    name: 'ddbErrorLogger',
  },
);

export const cwLogs = new CloudWatchLogsClient();
export const ssm = new SSMClient();
export const ses = new SESClient();
export const cisProvider = new CognitoIdentityProviderClient();
