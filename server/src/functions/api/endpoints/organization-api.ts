import * as db from 'core/db';
import { assignExistingFields } from 'core/utils';
import { processAndPutProfilePhoto } from 'core/utils/images-processing';
import express, { Request, Response } from 'express';

import { catchExpressJsErrorWrapper, validateOrganizationExists } from '../utils';
import type { UpdateOrganizationPostBody, UpdateProfilePicturePostBody } from './types';

export const getAllOrganizations = async (req: Request, res: Response) => {
  const organizations = await db.getAllOrganizations();
  organizations.sort((a, b) => (a.name < b.name ? -1 : 1));
  res.json({
    items: organizations.map((c) => ({
      organizationId: c.organizationId,
      name: c.name,
      email: c.email,
      profilePictureS3Key: c.profilePictureS3Key,
    })),
  });
};

export const getOrganizationDetail = async (req: Request, res: Response) => {
  const organization = await db.getOrganization(req.user.isaId);
  res.json(organization);
};

export const updateOrganization = async (
  req: Request<any, any, UpdateOrganizationPostBody>,
  res: Response,
) => {
  const { name, city, contactPhone, country } = req.body;
  const organization = await validateOrganizationExists(req.user.isaId);
  const updatedOrganization = assignExistingFields(organization, {
    name,
    city,
    contactPhone,
    country,
  });
  await db.putOrganization(updatedOrganization);
  res.end();
};

export const updateOrganizationProfilePicture = async (
  req: Request<any, any, UpdateProfilePicturePostBody>,
  res: Response,
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
  res.json({});
};

export const getUsersOfOrganization = async (req: Request, res: Response) => {
  const id = req.user.isaId;
  const usersOfOrganization = await db.getUsersOfOrganization(id);
  if (usersOfOrganization.length > 0) {
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

    res.json({ items });
  } else {
    res.json({ items: [] });
  }
};

export const approveUserJoinRequest = async (req: Request, res: Response) => {
  const organizationId = req.user.isaId;
  const userId = req.params.userId;
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (userOrganization?.isPendingApproval) {
    await db.updateOrganizationField(organizationId, userId, 'isPendingApproval', false);
  }
  res.end();
};

export const removeUser = async (req: Request, res: Response) => {
  const organizationId = req.user.isaId;
  const userId = req.params.userId;
  const userOrganization = await db.getUserOrganization(userId, organizationId);
  if (userOrganization) {
    await db.removeUserOrganization(userId, organizationId);
  }
  res.end();
};

export const organizationApi = express.Router();
organizationApi.get('/all', catchExpressJsErrorWrapper(getAllOrganizations));
organizationApi.put('/details', catchExpressJsErrorWrapper(updateOrganization));
organizationApi.put(
  '/profilePicture',
  catchExpressJsErrorWrapper(updateOrganizationProfilePicture),
);
organizationApi.get('/details', catchExpressJsErrorWrapper(getOrganizationDetail));
organizationApi.get('/users', catchExpressJsErrorWrapper(getUsersOfOrganization));
organizationApi.post('/user/:userId/approve', catchExpressJsErrorWrapper(approveUserJoinRequest));
organizationApi.delete('/user/:userId', catchExpressJsErrorWrapper(removeUser));
