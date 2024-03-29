import * as db from 'core/db';
import { UpdateProfilePicturePostBody, UpdateUserPostBody } from '@functions/api/endpoints/types';
import { isaToolsApi } from 'core/external-api/isa-tools-api';
import { assignExistingFields } from 'core/utils';
import { sendEmail } from 'core/utils/email';
import {
  userJoinNotificationEmailTemplate,
  userLeaveNotificationEmailTemplate,
} from 'core/utils/email/emailTypes';
import { processAndPutProfilePhoto } from 'core/utils/images-processing';
import express, { Request } from 'express';

import { expressRoute, validateOrganizationExists, validateUserExists } from '../utils';

export const getUserDetails = async (req: Request) => {
  const user = await db.getUser(req.user.isaId);
  return user;
};

export const getOrganizationsOfUser = async (req: Request) => {
  const userOrganizations = await db.getOrganizationsOfUser(req.user.isaId);
  const organizations = await db.getOrganizations(userOrganizations.map((c) => c.organizationId));
  const items = organizations
    .map((c) => {
      const userOrganization = userOrganizations.find((u) => u.organizationId === c.organizationId);
      return {
        ...c,
        ...userOrganization,
      };
    })
    .sort((a, b) => (a.joinedAt > b.joinedAt ? -1 : 1));
  return { items };
};

export const updateUser = async (req: Request<any, any, UpdateUserPostBody>) => {
  const { name, surname, birthDate, city, country, emergencyContact, gender, phoneNumber } =
    req.body;
  const user = await validateUserExists(req.user.isaId);
  const updatedUser = assignExistingFields(user, {
    name,
    surname,
    birthDate,
    city,
    country,
    emergencyContact,
    gender,
    phoneNumber,
  });
  await db.putUser(updatedUser);
  return {};
};

export const updateUserProfilePicture = async (
  req: Request<any, any, UpdateProfilePicturePostBody>,
) => {
  const user = await validateUserExists(req.user.isaId);
  if (!req.body.processingBucketKey) {
    delete user.profilePictureS3Key;
    await db.putUser(user);
  } else {
    const { s3Key } = await processAndPutProfilePhoto(req.body.processingBucketKey, req.user.isaId);
    user.profilePictureS3Key = s3Key;
    await db.putUser(user);
  }
  return {};
};

export const joinOrganization = async (req: Request) => {
  const organizationId = req.params.id;
  const { userId, name, surname } = await validateUserExists(req.user.isaId);
  const organization = await validateOrganizationExists(organizationId);
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (!userOrganization) {
    await db.putUserOrganization({
      organizationId: organizationId,
      userId: userId,
      isPendingApproval: true,
      joinedAt: new Date().toISOString(),
    });
  }

  const { html, subject } = userJoinNotificationEmailTemplate(name, surname);
  await sendEmail({ address: organization.email, subject, html });

  return {};
};

export const getOrganizationMembershipDocument = async (req: Request) => {
  const organizationId = req.params.id;
  const { userId, name, surname } = await validateUserExists(req.user.isaId);
  const organization = await validateOrganizationExists(organizationId);
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (!userOrganization) {
    throw new Error('User is not a member of this organization');
  }
  const expiresInSeconds = 60 * 60 * 24 * 7;
  const { token, verificationUrl, expiresAt } = await isaToolsApi.signDocument({
    subject: `${name} ${surname}`,
    expiresInSeconds: expiresInSeconds,
    createHash: true,
    content: `"${name} ${surname}" is a member of "${organization.name}"`,
  });

  return {
    token,
    verificationUrl,
    expiresAt,
  };
};

export const leaveOrganization = async (req: Request) => {
  const organizationId = req.params.id;
  const { name, surname } = await validateUserExists(req.user.isaId);
  const organization = await validateOrganizationExists(organizationId);

  await db.removeUserOrganization(req.user.isaId, organizationId);

  const { html, subject } = userLeaveNotificationEmailTemplate(name, surname);
  await sendEmail({ address: organization.email, subject, html });

  return {};
};

export const userApi = express.Router();
userApi.get('/details', expressRoute(getUserDetails));
userApi.put('/details', expressRoute(updateUser));
userApi.put('/profilePicture', expressRoute(updateUserProfilePicture));
userApi.get('/organizations', expressRoute(getOrganizationsOfUser));
userApi.post('/organization/:id/join', expressRoute(joinOrganization));
userApi.delete('/organization/:id', expressRoute(leaveOrganization));
userApi.get(
  '/organization/:id/membershipDocument',
  expressRoute(getOrganizationMembershipDocument),
);
