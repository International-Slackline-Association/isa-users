import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateOrganizationExists, validateUserExists } from '../utils';
import * as db from 'core/db';
import { UpdateUserPostBody } from '@functions/api/endpoints/types';
import { assignExistingFields } from 'core/utils';

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
  const { name, surname, birthDate, city, country, emergencyContact, gender, phoneNumber, profilePictureUrl } =
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
    profilePictureUrl,
  });
  await db.putUser(updatedUser);

  res.end();
};

export const joinOrganization = async (req: Request, res: Response) => {
  const organizationId = req.params.id;
  const { userId } = await validateUserExists(req.user.isaId);
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
  // TODO: Send email to organization
  res.end();
};

export const leaveOrganization = async (req: Request, res: Response) => {
  const organizationId = req.params.id;
  await db.removeUserOrganization(req.user.isaId, organizationId);
  // TODO: Send email to organization
  res.end();
};

export const userApi = express.Router();
userApi.get('/details', catchExpressJsErrorWrapper(getUserDetails));
userApi.put('/details', catchExpressJsErrorWrapper(updateUser));
userApi.get('/organizations', catchExpressJsErrorWrapper(getOrganizationsOfUser));
userApi.post('/organization/:id/join', catchExpressJsErrorWrapper(joinOrganization));
userApi.delete('/organization/:id', catchExpressJsErrorWrapper(leaveOrganization));
