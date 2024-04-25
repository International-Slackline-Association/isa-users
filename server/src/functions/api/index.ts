import type { AWS } from '@serverless/typescript';
import { handlerPath } from 'core/utils/lambda';

const lambda: AWS['functions'][0] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'any',
        path: '/verify/{proxy+}',
      },
    },
    {
      http: {
        method: 'any',
        path: '/{proxy+}',
        cors: {
          origin: '*',
          headers: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token',
            'X-Amz-User-Agent',
          ],
        },
        authorizer: {
          arn: '${ssm:isa-users-cognitoPoolArn}',
        },
      },
    },
  ],
  logRetentionInDays: 90,
};

export default lambda;
