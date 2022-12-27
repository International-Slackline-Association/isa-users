import serverlessExpress from '@vendia/serverless-express';
import { logger } from 'core/logger';
import app from './app';

logger.updateMeta({ lambdaName: 'public-api' });
export const main = serverlessExpress({
  app,
});
