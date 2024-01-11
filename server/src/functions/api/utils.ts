import * as db from 'core/db';
import { Request, Response } from 'express';

export const catchExpressJsErrorWrapper = (
  f: (req: Request, res: Response, next?) => Promise<any>,
) => {
  return (req: Request, res: Response, next) => {
    f(req, res, next).catch(next);
  };
};

export const validateUserExists = async (userId: string) => {
  const user = await db.getUser(userId);
  if (!user) {
    throw new Error(`User ${userId} does not exist`);
  }
  return user;
};

export const validateOrganizationExists = async (organizationId: string) => {
  const organization = await db.getOrganization(organizationId);
  if (!organization) {
    throw new Error(`Organization ${organizationId} does not exist`);
  }
  return organization;
};
