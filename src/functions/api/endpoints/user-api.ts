import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper } from '../utils';
import * as db from 'core/db';
import { UpdateUserPostBody } from '@functions/api/endpoints/types';
import { assignExistingFields } from 'core/utils';

export const getUserDetails = async (req: Request, res: Response) => {
  const user = await db.getUser(req.user.email);
  res.json(user);
};

export const getClubsOfUser = async (req: Request, res: Response) => {
  const userClubs = await db.getClubsOfUser(req.user.email);
  const clubs = await db.getClubs(userClubs.map((c) => c.clubId));
  res.json({ items: clubs });
};

export const updateUser = async (req: Request<any, any, UpdateUserPostBody>, res: Response) => {
  const { name, surname, birthDate, city, country, emergencyContact, gender, phoneNumber } = req.body;
  const user = await db.getUser(req.user.email);
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
  res.end();
};

export const userApi = express.Router();
userApi.get('/details', catchExpressJsErrorWrapper(getUserDetails));
userApi.get('/clubs', catchExpressJsErrorWrapper(getClubsOfUser));
userApi.put('/:id', catchExpressJsErrorWrapper(updateUser));
