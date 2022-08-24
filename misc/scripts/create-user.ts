import AWS from 'aws-sdk';
import config from '../config.json';

export const cisProvider = new AWS.CognitoIdentityServiceProvider();

interface Options {
  username: string;
  name: string;
  surname: string;
  identityType?: 'organization' | 'individual';
}

const createUser = async (opts: Options) => {
  await cisProvider
    .adminCreateUser({
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
          Value: opts.identityType || 'individual',
        },
      ],
    })
    .promise();
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

if (type !== 'individual' && type !== 'organization') {
  throw new Error('Wrong type');
}

createUser({ username: email, name, surname, identityType: type });
