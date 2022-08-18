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

createUser({ username: '', name: '', surname: '', identityType: 'organization' });
