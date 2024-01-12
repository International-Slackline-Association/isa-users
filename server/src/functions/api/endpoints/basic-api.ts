import * as db from 'core/db';
import { DDBOrganizationItem } from 'core/db/organization/types';
import { DDBUserDetailItem } from 'core/db/user/details/types';
import express, { Request } from 'express';

import { expressRoute } from '../utils';

export const getUserDetails = async (req: Request) => {
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
    isaId: req.user.isaId,
    name: details.name,
    surname: details['surname'],
    email: details.email,
    profilePictureUrl: details.profilePictureS3Key
      ? `https://images.slacklineinternational.org/${details.profilePictureS3Key}`
      : undefined,
    identityType: identityType,
  };

  return response;
};

export const basicApi = express.Router();
basicApi.get('/userDetails', expressRoute(getUserDetails));
