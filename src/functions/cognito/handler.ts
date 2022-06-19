import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import * as db from 'core/db';
import { logger } from 'core/logger';

logger.updateMeta({ lambdaName: 'cognito-trigger' });
const cognitoTrigger: PostConfirmationTriggerHandler = async (event) => {
  try {
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      const { email, family_name, name, sub } = event.request.userAttributes;
      const clubs = await db.getClubsWithEmail(email);
      const isIndividual = clubs.length === 0;
      const surname = isIndividual ? family_name : '';

      await db.putUser({
        userId: email,
        email: email,
        name: name,
        surname: surname,
        cognitoSub: sub,
        identityType: isIndividual ? 'individual' : 'club',
      });
    }
    return event;
  } catch (error) {
    logger.error(error.message, { event });
    throw error;
  }
};

export const main = cognitoTrigger;
