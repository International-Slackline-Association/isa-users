import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateOrganizationExists, validateUserExists } from '../utils';
import * as db from 'core/db';
import { DDBUserDetailItem } from 'core/db/user/details/types';
import { DDBOrganizationItem } from 'core/db/organization/types';

export const getUserDetails = async (req: Request, res: Response) => {
  let details: DDBUserDetailItem | DDBOrganizationItem;
  let identityType = 'individual';
  details = await db.getUser(req.user.isaId);
  if (!details) {
    details = await db.getOrganization(req.user.isaId);
    identityType = 'organization';
  }

  if (!details) {
    throw new Error(`User ${req.user.isaId} not found`);
  }

  const response = {
    name: details.name,
    surname: details['surname'],
    email: details.email,
    profilePictureUrl: details.profilePictureUrl,
    identityType: identityType,
  };

  res.json(response);
};

export const basicApi = express.Router();
basicApi.get('/userDetails', catchExpressJsErrorWrapper(getUserDetails));
