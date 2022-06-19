import type { AWS } from '@serverless/typescript';

import { handlerPath } from 'core/utils/lambda';

const lambda: AWS['functions'][0] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      cognitoUserPool: {
        existing: true,
        trigger: 'PostConfirmation',
        pool: 'isa-users',
      },
    },
  ],
  logRetentionInDays: 90,
};

export default lambda;
