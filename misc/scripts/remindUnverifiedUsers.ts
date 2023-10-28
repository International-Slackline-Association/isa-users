import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import config from '../config.json';
import fs from 'fs';
import path from 'path';

export const ses = new AWS.SES();

export const cisProvider = new AWS.CognitoIdentityServiceProvider();
dotenv.config();

const html = fs.readFileSync(path.join(__dirname, '../cognito/email-templates/verify-account.html'), 'utf8').toString();

const remindUnverifiedUsers = async () => {
  const users = await getAllCognitoUsers();

  const unverifiedUsers = users.filter((user) => user.email_verified === 'false');

  console.log('unverifiedUsers', unverifiedUsers.length);
  // let count = 0;
  // for (const user of unverifiedUsers) {
  //   await sendReminderEmail(user.email);
  //   console.log(count, user.email);
  //   await new Promise((resolve) => setTimeout(resolve, 300, null));
  //   count++;
  // }
};

export const getAllCognitoUsers = async () => {
  let paginationToken: any = undefined;
  const users = [];
  do {
    const result = await cisProvider
      .listUsers({
        UserPoolId: config.UserPoolId,
        PaginationToken: paginationToken,
      })
      .promise();

    paginationToken = result?.PaginationToken;
    users.push(...result.Users);
  } while (paginationToken);
  return users.map((user) => ({
    username: user.Username,
    sub: user.Attributes?.find((attr) => attr.Name === 'sub')?.Value,
    email: user.Attributes?.find((attr) => attr.Name === 'email')?.Value,
    email_verified: user.Attributes?.find((attr) => attr.Name === 'email_verified')?.Value,
    createdDate: user.UserCreateDate,
  }));
};

export const sendReminderEmail = async (email: string) => {
  await ses
    .sendEmail({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reminder: Verify your email address!',
        },
      },
      ReplyToAddresses: ['account@slacklineinternational.org'],
      Source: '"ISA Account" <account@slacklineinternational.org>',
    })
    .promise();
};

remindUnverifiedUsers();
