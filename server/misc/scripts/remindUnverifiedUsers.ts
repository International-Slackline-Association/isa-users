// import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
// import { isaToolsApi } from 'core/external-api/isa-tools-api';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import path from 'path';

// import { getAllCognitoUsers } from './utils';

// dotenv.config();

// const ses = new SESClient();

// const template = fs
//   .readFileSync(path.join(__dirname, '../cognito/email-templates/verify-account.html'), 'utf8')
//   .toString();

// const remindUnverifiedUsers = async () => {
//   // const users = await getAllCognitoUsers();

//   // const unverifiedUsers = users.filter((user) => user.email_verified === 'false');

//   // console.log('unverifiedUsers:', unverifiedUsers.length);

//   const unverifiedUsers = [
//     {
//       email: 'cann2005@gmail.com',
//     },
//   ];
//   let count = 0;
//   for (const user of unverifiedUsers) {
//     const x = await isaToolsApi.generateVerificationToken(user.email);
//     await _sendReminderEmail(user.email);
//     console.log(count, user.email);
//     await new Promise((resolve) => setTimeout(resolve, 300, null));
//     count++;
//   }
// };

// const _sendReminderEmail = async (email: string) => {
//   const html = template.replace(/{{{{VERIFICATION_URL}}}}/g, ``);
//   await ses.send(
//     new SendEmailCommand({
//       Destination: {
//         ToAddresses: [email],
//       },
//       Message: {
//         Body: {
//           Html: {
//             Charset: 'UTF-8',
//             Data: html,
//           },
//         },
//         Subject: {
//           Charset: 'UTF-8',
//           Data: 'Reminder: Verify your email address!',
//         },
//       },
//       ReplyToAddresses: ['account@slacklineinternational.org'],
//       Source: '"ISA Account" <account@slacklineinternational.org>',
//     }),
//   );
// };

// remindUnverifiedUsers();
