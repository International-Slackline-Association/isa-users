import * as db from 'core/db';
import { NextFunction, Request, Response } from 'express';

export const expressRoute = (
  f: (req: Request<any, any, any, any>, res: Response, next?: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: any) => {
    f(req, res, next)
      .then((result) => {
        if (typeof result === 'object') {
          res.json(result);
        }
      })
      .catch(next);
  };
};

export const validateUserExists = async (userId: string) => {
  const user = await db.getUser(userId);
  if (!user) {
    throw new Error(`User ${userId} does not exist`);
  }
  return user;
};
