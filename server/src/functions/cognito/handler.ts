import * as db from 'core/db';
import type { PostConfirmationTriggerEvent, PreSignUpTriggerEvent } from 'aws-lambda';
import { logger } from 'core/logger';
import { generateISAIdFromUsername } from 'core/utils';

import { sendEmailVerificationLink } from './verify';

logger.updateMeta({ lambdaName: 'cognito-trigger' });
const cognitoTrigger = async (event: PreSignUpTriggerEvent | PostConfirmationTriggerEvent) => {
  try {
    if (event.triggerSource === 'PreSignUp_AdminCreateUser') {
      await createUser(event.userName, event.request.userAttributes);
    }
    if (event.triggerSource === 'PreSignUp_SignUp') {
      await createUser(event.userName, event.request.userAttributes);
      event.response.autoConfirmUser = true;
    }
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      try {
        await sendEmailVerificationLink(event.userName, event.request.userAttributes.email);
      } catch (e) {
        logger.error(e.message, { event });
      }
    }
    return event;
  } catch (error) {
    logger.error(error.message, { event });
    throw error;
  }
};

const createUser = async (
  username: string,
  attrs: { name?: string; family_name?: string; email?: string; sub?: string },
) => {
  const isaId = generateISAIdFromUsername(username);
  await db.putUser({
    userId: isaId,
    email: attrs.email,
    name: attrs.name,
    surname: attrs.family_name,
    cognitoUsername: username,
    cognitoSub: attrs.sub || username,
    createdDateTime: new Date().toISOString(),
  });
};

export const main = cognitoTrigger;
