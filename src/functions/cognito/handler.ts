import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { cisProvider } from 'core/aws/clients';
import * as db from 'core/db';
import { logger } from 'core/logger';
import { generateIdFromEmail } from 'core/utils';

logger.updateMeta({ lambdaName: 'cognito-trigger' });
const cognitoTrigger: PostConfirmationTriggerHandler = async (event) => {
  try {
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      const { email, family_name, name, sub } = event.request.userAttributes;
      const id = generateIdFromEmail(email);
      const isaMember = await db.getISAMember(email);
      if (isaMember) {
        await db.putClub({
          clubId: id,
          email: email,
          name: name,
          cognitoSub: sub,
          memberType: isaMember.memberType,
        });
      } else {
        await db.putUser({
          userId: id,
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
            {
              Name: 'custom:ISA_ID',
              Value: id,
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
