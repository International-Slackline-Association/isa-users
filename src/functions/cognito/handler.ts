import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import * as db from 'core/db';
import { logger } from 'core/logger';

const cisProvider = new AWS.CognitoIdentityServiceProvider();

logger.updateMeta({ lambdaName: 'cognito-trigger' });
const cognitoTrigger: PostConfirmationTriggerHandler = async (event) => {
  try {
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      const { email, family_name, name, sub } = event.request.userAttributes;
      const isaMember = await db.getISAMember(email);
      if (isaMember) {
        await db.putClub({
          clubId: email,
          email: email,
          name: name,
          cognitoSub: sub,
          memberType: isaMember.memberType,
        });
      } else {
        await db.putUser({
          userId: email,
          email: email,
          name: name,
          surname: family_name,
          cognitoSub: sub,
        });
      }
      await cisProvider
        .adminUpdateUserAttributes({
          UserPoolId: event.userPoolId,
          Username: event.userName,
          UserAttributes: [
            {
              Name: 'custom:identityType',
              Value: isaMember ? 'club' : 'individual',
            },
          ],
        })
        .promise();
    }
    return event;
  } catch (error) {
    logger.error(error.message, { event });
    throw error;
  }
};

export const main = cognitoTrigger;
