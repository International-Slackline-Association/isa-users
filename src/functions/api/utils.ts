import { Request, Response } from 'express';
import * as db from 'core/db';

export const catchExpressJsErrorWrapper = (f: (req: Request, res: Response, next?) => Promise<any>) => {
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

export const validateClubExists = async (clubId: string) => {
  const club = await db.getClub(clubId);
  if (!club) {
    throw new Error(`Club ${clubId} does not exist`);
  }
  return club;
};
