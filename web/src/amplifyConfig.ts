import { ResourcesConfig } from 'aws-amplify';

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_iGaYGKeyJ',
      userPoolClientId: '59gg1oof4ik4nk46entj56lnnq',
      identityPoolId: 'eu-central-1:e77377fc-74a7-49f3-bba9-0c137f8ed9ef',
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: 'auth.slacklineinternational.org',
          scopes: ['email', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: ['http://localhost:5173', 'https://account.slacklineinternational.org'],
          redirectSignOut: ['http://localhost:5173', 'https://account.slacklineinternational.org'],
          responseType: 'code',
        },
      },
    },
  },
  Storage: {
    S3: {
      bucket: 'isa-tools-temporary-uploads-prod',
      region: 'eu-central-1',
    },
  },
};
