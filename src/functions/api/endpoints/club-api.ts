import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper } from '../utils';
import * as db from 'core/db';
import type { CreateClubPostBody } from './types';
import { assignExistingFields } from 'core/utils';

export const getAllClubs = async (req: Request, res: Response) => {
  const clubs = await db.getAllClubs();
  res.json({
    items: clubs.map((c) => ({
      id: c.clubId,
      name: c.name,
      email: c.email,
    })),
  });
};

export const getClubDetail = async (req: Request, res: Response) => {
  const id = req.params.id;
  const club = await db.getClub(id);
  res.json(club);
};

export const createClub = async (req: Request<any, any, CreateClubPostBody>, res: Response) => {
  const body = req.body;
  await db.putClub(body);
  res.end();
};

export const updateClub = async (req: Request<any, any, CreateClubPostBody>, res: Response) => {
  const { email, name, city, contactPhone, country, profilePictureUrl } = req.body;
  const club = await db.getClub(req.params.id);
  const updatedClub = assignExistingFields(club, { email, name, city, contactPhone, country, profilePictureUrl });
  await db.putClub(updatedClub);
  res.end();
};

export const getUsersOfClub = async (req: Request, res: Response) => {
  const id = req.params.id;
  const usersOfClub = await db.getUsersOfClub(id);
  const users = await db.getUsers(usersOfClub.map((u) => u.userId));
  res.json({
    items: users.map((u, index) => ({
      id: u.userId,
      name: u.name,
      surname: u.surname,
      email: u.email,
      isPendingApproval: usersOfClub[index].isPendingApproval,
    })),
  });
};

export const clubApi = express.Router();
clubApi.get('/all', catchExpressJsErrorWrapper(getAllClubs));
clubApi.get('/:id', catchExpressJsErrorWrapper(getClubDetail));
clubApi.get('/:id/users', catchExpressJsErrorWrapper(getUsersOfClub));
clubApi.post('/', catchExpressJsErrorWrapper(createClub));
clubApi.put('/:id', catchExpressJsErrorWrapper(updateClub));
