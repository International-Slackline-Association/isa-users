import type { Handler } from 'aws-lambda';
import { logger } from 'core/logger';

logger.updateMeta({ lambdaName: 'migrations' });
const migrationsHandler: Handler = async (_event) => {
  // await migrateProfilePicture();
};

export const main = migrationsHandler;
