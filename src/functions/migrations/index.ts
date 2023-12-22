import type { AWS } from '@serverless/typescript';

import { handlerPath } from 'core/utils/lambda';

const lambda: AWS['functions'][0] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [],
  logRetentionInDays: 90,
  timeout: 30,
};

export default lambda;
