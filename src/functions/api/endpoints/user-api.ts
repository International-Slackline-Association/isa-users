import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateOrganizationExists, validateUserExists } from '../utils';
import * as db from 'core/db';
import { UpdateProfilePicturePostBody, UpdateUserPostBody } from '@functions/api/endpoints/types';
import { assignExistingFields } from 'core/utils';
import { sendEmail } from 'core/utils/email';
import { userJoinNotificationEmailTemplate, userLeaveNotificationEmailTemplate } from 'core/utils/email/emailTypes';
import { processAndPutProfilePhoto } from 'core/utils/images-processing';
import { isaDocumentApi } from 'core/external-api/isa-documents-api';

export const getUserDetails = async (req: Request, res: Response) => {
  const user = await db.getUser(req.user.isaId);
  res.json(user);
};

export const getOrganizationsOfUser = async (req: Request, res: Response) => {
  const userOrganizations = await db.getOrganizationsOfUser(req.user.isaId);
  if (userOrganizations.length > 0) {
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
    res.json({ items });
  } else {
    res.json({ items: [] });
  }
};

export const updateUser = async (req: Request<any, any, UpdateUserPostBody>, res: Response) => {
  const { name, surname, birthDate, city, country, emergencyContact, gender, phoneNumber } = req.body;
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
  res.json({});
};

export const updateUserProfilePicture = async (req: Request<any, any, UpdateProfilePicturePostBody>, res: Response) => {
  const user = await validateUserExists(req.user.isaId);
  if (!req.body.processingBucketKey) {
    delete user.profilePictureS3Key;
    await db.putUser(user);
  } else {
    const { s3Key } = await processAndPutProfilePhoto(req.body.processingBucketKey, req.user.isaId);
    user.profilePictureS3Key = s3Key;
    await db.putUser(user);
  }
  res.json({});
};

export const joinOrganization = async (req: Request, res: Response) => {
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

  res.end();
};

export const getOrganizationMembershipDocument = async (req: Request, res: Response) => {
  const organizationId = req.params.id;
  const { userId, name, surname } = await validateUserExists(req.user.isaId);
  const organization = await validateOrganizationExists(organizationId);
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (!userOrganization) {
    throw new Error('User is not a member of this organization');
  }
  const expiresInSeconds = 60 * 60 * 24 * 7;
  const { hash, token, verificationUrl, expiresAt } = await isaDocumentApi.signDocument({
    subject: `${name} ${surname}`,
    expiresInSeconds: expiresInSeconds,
    createHash: true,
    content: `"${name} ${surname}" is a member of "${organization.name}"`,
  });

  res.json({
    hash,
    token,
    verificationUrl,
    expiresAt,
  });
};

export const leaveOrganization = async (req: Request, res: Response) => {
  const organizationId = req.params.id;
  const { name, surname } = await validateUserExists(req.user.isaId);
  const organization = await validateOrganizationExists(organizationId);

  await db.removeUserOrganization(req.user.isaId, organizationId);

  const { html, subject } = userLeaveNotificationEmailTemplate(name, surname);
  await sendEmail({ address: organization.email, subject, html });

  res.end();
};

export const userApi = express.Router();
userApi.get('/details', catchExpressJsErrorWrapper(getUserDetails));
userApi.put('/details', catchExpressJsErrorWrapper(updateUser));
userApi.put('/profilePicture', catchExpressJsErrorWrapper(updateUserProfilePicture));
userApi.get('/organizations', catchExpressJsErrorWrapper(getOrganizationsOfUser));
userApi.post('/organization/:id/join', catchExpressJsErrorWrapper(joinOrganization));
userApi.delete('/organization/:id', catchExpressJsErrorWrapper(leaveOrganization));
userApi.get('/organization/:id/membershipDocument', catchExpressJsErrorWrapper(getOrganizationMembershipDocument));
