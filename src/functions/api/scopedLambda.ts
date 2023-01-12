import type { AWS } from '@serverless/typescript';
import { handlerPath } from 'core/utils/lambda';

// Workaround for https://github.com/aws-amplify/amplify-ui/issues/237#issuecomment-1380884704
//
const lambda: AWS['functions'][0] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'any',
        path: '/scoped/{proxy+}',
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
          scopes: ['default/user', 'default/organization'],
        },
      },
    },
  ],
  logRetentionInDays: 90,
};

export default lambda;
