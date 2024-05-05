import { sendEmailVerificationLink } from '@functions/cognito/verify';

import { getAllCognitoUsers } from './utils';

export const remindUnverifiedUsers = async () => {
  const users = await getAllCognitoUsers();

  const unverifiedUsers = users.filter((user) => user.email_verified === 'false');

  console.log('unverifiedUsers:', unverifiedUsers.length);

  let count = 0;
  for (const user of unverifiedUsers) {
    await sendEmailVerificationLink(user.username, user.email);
    console.log(count, user.email);
    await new Promise((resolve) => setTimeout(resolve, 300, null));
    count++;
  }
};
