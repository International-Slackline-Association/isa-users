import type { AWS } from '@serverless/typescript';
import { handlerPath } from 'core/utils/lambda';

const lambda: AWS['functions'][0] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'any',
        path: 'public/{proxy+}',
        cors: true,
      },
    },
  ],
  logRetentionInDays: 90,
};

export default lambda;
