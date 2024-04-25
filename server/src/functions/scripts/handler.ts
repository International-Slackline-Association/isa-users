import { sendEmailVerificationLink } from '@functions/cognito/verify';
import type { Handler } from 'aws-lambda';
import { logger } from 'core/logger';

logger.updateMeta({ lambdaName: 'scripts' });
const scriptsHandler: Handler = async (_event) => {
  await remindUnverifiedUsers();
};

const remindUnverifiedUsers = async () => {
  // const users = await getAllCognitoUsers();

  // const unverifiedUsers = users.filter((user) => user.email_verified === 'false');

  // console.log('unverifiedUsers:', unverifiedUsers.length);

  const unverifiedUsers = [
    {
      username: 'bacefdb4-1b14-4f12-8f0a-664801ff624e',
      email: 'cann2005@gmail.com',
    },
  ];
  let count = 0;
  for (const user of unverifiedUsers) {
    await sendEmailVerificationLink(user.username, user.email);
    console.log(count, user.email);
    await new Promise((resolve) => setTimeout(resolve, 300, null));
    count++;
  }
};

export const main = scriptsHandler;
