import serverlessExpress from '@codegenie/serverless-express';
import { logger } from 'core/logger';

import app from './app';

logger.updateMeta({ lambdaName: 'api' });
export const main = serverlessExpress({
  app,
});
