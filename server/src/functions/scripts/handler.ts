import type { Handler } from 'aws-lambda';
import { logger } from 'core/logger';

// import { listIncorrectItems } from './listIncorrectItems';
// import { remindUnverifiedUsers } from './verifyEmailReminders';
// import { exportCognitoUsers } from './exportCognitoUsers';

logger.updateMeta({ lambdaName: 'scripts' });
const scriptsHandler: Handler = async (_event) => {
  // await remindUnverifiedUsers();
  // await listIncorrectItems();
  // await exportCognitoUsers();
};

export const main = scriptsHandler;
