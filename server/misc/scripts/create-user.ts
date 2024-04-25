import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

import config from '../config.json';

export const cisProvider = new CognitoIdentityProviderClient();

interface Options {
  username: string;
  name: string;
  surname: string;
}

const createUser = async (opts: Options) => {
  await cisProvider.send(
    new AdminCreateUserCommand({
      Username: opts.username,
      UserPoolId: config.UserPoolId,
      UserAttributes: [
        {
          Name: 'email',
          Value: opts.username,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'name',
          Value: opts.name,
        },
        {
          Name: 'family_name',
          Value: opts.surname,
        },
        {
          Name: 'custom:identityType',
          Value: 'individual',
        },
      ],
    }),
  );
};

const findArg = (args: string[], field: string) => {
  const index = args.findIndex((arg) => arg.startsWith(field));
  if (index !== -1) {
    return args[index + 1];
  }
  return undefined;
};

const args = process.argv.slice(2);
const email = findArg(args, '--email');
const name = findArg(args, '--name');
const surname = findArg(args, '--surname');
const type = findArg(args, '--type');

if (!email || !name || !surname || !type) {
  throw new Error('Missing arguments');
}

createUser({ username: email, name, surname });
