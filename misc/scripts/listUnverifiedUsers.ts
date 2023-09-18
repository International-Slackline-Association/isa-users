import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import config from '../config.json';

export const cisProvider = new AWS.CognitoIdentityServiceProvider();
dotenv.config();

const listUnverifiedUsers = async () => {
  const users = await getAllCognitoUsers();

  const unverifiedUsers = users.filter((user) => user.email_verified === 'false');
  console.log('unverified users', unverifiedUsers);
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

listUnverifiedUsers();
