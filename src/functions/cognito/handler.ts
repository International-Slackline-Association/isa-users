import type { PostConfirmationTriggerEvent, PreSignUpTriggerEvent, PostAuthenticationTriggerEvent } from 'aws-lambda';
import { cisProvider } from 'core/aws/clients';
import * as db from 'core/db';
import { logger } from 'core/logger';
import { generateISAIdFromUsername } from 'core/utils';

logger.updateMeta({ lambdaName: 'cognito-trigger' });
const cognitoTrigger = async (event: PreSignUpTriggerEvent | PostConfirmationTriggerEvent) => {
  try {
    if (event.triggerSource === 'PreSignUp_AdminCreateUser') {
      await createUser(event.userName, event.request.userAttributes);
    }
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      await createUser(event.userName, event.request.userAttributes);
      await updateCognitoAttributes(event.userName, event.userPoolId, event.request.userAttributes);
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
  const isaMember = await db.getISAMember(attrs.email);
  if (isaMember) {
    await db.putClub({
      clubId: isaId,
      email: attrs.email,
      name: attrs.name,
      cognitoSub: attrs.sub,
      cognitoUsername: username,
      memberType: isaMember.memberType,
    });
  } else {
    await db.putUser({
      userId: isaId,
      email: attrs.email,
      name: attrs.name,
      surname: attrs.family_name,
      cognitoUsername: username,
      cognitoSub: attrs.sub,
    });
  }
};

const updateCognitoAttributes = async (
  username: string,
  userPoolId: string,
  attrs: { name?: string; family_name?: string; email?: string; sub?: string },
) => {
  const isaMember = await db.getISAMember(attrs.email);
  await cisProvider
    .adminUpdateUserAttributes({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:identityType',
          Value: isaMember ? 'club' : 'individual',
        },
      ],
    })
    .promise();
};

export const main = cognitoTrigger;
