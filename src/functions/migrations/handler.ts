import type { Handler } from 'aws-lambda';
import * as db from 'core/db';
import { logger } from 'core/logger';

logger.updateMeta({ lambdaName: 'migrations' });
const migrationsHandler: Handler = async (event) => {
  // await migrateProfilePicture();
};


export const main = migrationsHandler;
