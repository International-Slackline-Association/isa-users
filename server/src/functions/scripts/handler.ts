import type { Handler } from 'aws-lambda';
import { logger } from 'core/logger';

// import { listIncorrectItems } from './listIncorrectItems';
// import { remindUnverifiedUsers } from './verifyEmailReminders';

logger.updateMeta({ lambdaName: 'scripts' });
const scriptsHandler: Handler = async (_event) => {
  // await remindUnverifiedUsers();
  // await listIncorrectItems();
};

export const main = scriptsHandler;
