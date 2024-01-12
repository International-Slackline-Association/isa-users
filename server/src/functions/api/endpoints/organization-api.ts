import * as db from 'core/db';
import { assignExistingFields } from 'core/utils';
import { processAndPutProfilePhoto } from 'core/utils/images-processing';
import express, { Request } from 'express';

import { expressRoute, validateOrganizationExists } from '../utils';
import type { UpdateOrganizationPostBody, UpdateProfilePicturePostBody } from './types';

export const getAllOrganizations = async () => {
  const organizations = await db.getAllOrganizations();
  organizations.sort((a, b) => (a.name < b.name ? -1 : 1));
  return {
    items: organizations.map((c) => ({
      organizationId: c.organizationId,
      name: c.name,
      email: c.email,
      profilePictureS3Key: c.profilePictureS3Key,
    })),
  };
};

export const getOrganizationDetail = async (req: Request) => {
  const organization = await db.getOrganization(req.user.isaId);
  return organization;
};

export const updateOrganization = async (req: Request<any, any, UpdateOrganizationPostBody>) => {
  const { name, city, contactPhone, country } = req.body;
  const organization = await validateOrganizationExists(req.user.isaId);
  const updatedOrganization = assignExistingFields(organization, {
    name,
    city,
    contactPhone,
    country,
  });
  await db.putOrganization(updatedOrganization);
  return {};
};

export const updateOrganizationProfilePicture = async (
  req: Request<any, any, UpdateProfilePicturePostBody>,
) => {
  const organization = await validateOrganizationExists(req.user.isaId);
  if (!req.body.processingBucketKey) {
    delete organization.profilePictureS3Key;
    await db.putOrganization(organization);
  } else {
    const { s3Key } = await processAndPutProfilePhoto(req.body.processingBucketKey, req.user.isaId);
    organization.profilePictureS3Key = s3Key;
    await db.putOrganization(organization);
  }
  return {};
};

export const getUsersOfOrganization = async (req: Request) => {
  const id = req.user.isaId;
  const usersOfOrganization = await db.getUsersOfOrganization(id);
  const users = await db.getUsers(usersOfOrganization.map((u) => u.userId));
  const items = users
    .map((u) => {
      const userOrganization = usersOfOrganization.find((c) => c.userId === u.userId);
      return {
        userId: u.userId,
        name: u.name,
        surname: u.surname,
        email: u.email,
        isPendingApproval: userOrganization.isPendingApproval,
        joinedAt: userOrganization.joinedAt,
        profilePictureS3Key: u.profilePictureS3Key,
      };
    })
    .sort((a, b) => (a.joinedAt > b.joinedAt ? -1 : 1));

  return { items };
};

export const approveUserJoinRequest = async (req: Request) => {
  const organizationId = req.user.isaId;
  const userId = req.params.userId;
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (userOrganization?.isPendingApproval) {
    await db.updateOrganizationField(organizationId, userId, 'isPendingApproval', false);
  }
  return {};
};

export const removeUser = async (req: Request) => {
  const organizationId = req.user.isaId;
  const userId = req.params.userId;
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (userOrganization) {
    await db.removeUserOrganization(userId, organizationId);
  }
  return {};
};

export const organizationApi = express.Router();
organizationApi.get('/all', expressRoute(getAllOrganizations));
organizationApi.put('/details', expressRoute(updateOrganization));
organizationApi.put('/profilePicture', expressRoute(updateOrganizationProfilePicture));
organizationApi.get('/details', expressRoute(getOrganizationDetail));
organizationApi.get('/users', expressRoute(getUsersOfOrganization));
organizationApi.post('/user/:userId/approve', expressRoute(approveUserJoinRequest));
organizationApi.delete('/user/:userId', expressRoute(removeUser));
