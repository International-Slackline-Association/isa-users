import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateClubExists } from '../utils';
import * as db from 'core/db';
import type { UpdateClubPostBody } from './types';
import { assignExistingFields } from 'core/utils';

export const getAllClubs = async (req: Request, res: Response) => {
  const clubs = await db.getAllClubs();
  clubs.sort((a, b) => (a.name < b.name ? -1 : 1));
  res.json({
    items: clubs.map((c) => ({
      id: c.clubId,
      name: c.name,
      email: c.email,
      profilePictureUrl: c.profilePictureUrl,
    })),
  });
};

export const getClubDetail = async (req: Request, res: Response) => {
  const club = await db.getClub(req.user.id);
  res.json(club);
};

export const updateClub = async (req: Request<any, any, UpdateClubPostBody>, res: Response) => {
  const { name, city, contactPhone, country, profilePictureUrl } = req.body;
  const club = await validateClubExists(req.user.id);
  const updatedClub = assignExistingFields(club, { name, city, contactPhone, country, profilePictureUrl });
  await db.putClub(updatedClub);
  res.end();
};

export const getUsersOfClub = async (req: Request, res: Response) => {
  const id = req.user.id;
  const usersOfClub = await db.getUsersOfClub(id);
  if (usersOfClub.length > 0) {
    const users = await db.getUsers(usersOfClub.map((u) => u.userId));
    const items = users
      .map((u) => {
        const userClub = usersOfClub.find((c) => c.userId === u.userId);
        return {
          id: u.userId,
          name: u.name,
          surname: u.surname,
          email: u.email,
          isPendingApproval: userClub.isPendingApproval,
          joinedAt: userClub.joinedAt,
          profilePictureUrl: u.profilePictureUrl,
        };
      })
      .sort((a, b) => (a.joinedAt > b.joinedAt ? -1 : 1));

    res.json({ items });
  } else {
    res.json({ items: [] });
  }
};

export const approveUserJoinRequest = async (req: Request, res: Response) => {
  const clubId = req.user.id;
  const userId = req.params.userId;
  const userClub = await db.getUserClub(userId, clubId);
  if (userClub?.isPendingApproval) {
    await db.updateClubField(clubId, userId, 'isPendingApproval', false);
  }
  res.end();
};

export const removeUser = async (req: Request, res: Response) => {
  const clubId = req.user.id;
  const userId = req.params.userId;
  const userClub = await db.getUserClub(userId, clubId);
  if (userClub) {
    await db.removeUserClub(userId, clubId);
  }
  res.end();
};

export const clubApi = express.Router();
clubApi.get('/all', catchExpressJsErrorWrapper(getAllClubs));
clubApi.put('/details', catchExpressJsErrorWrapper(updateClub));
clubApi.get('/details', catchExpressJsErrorWrapper(getClubDetail));
clubApi.get('/users', catchExpressJsErrorWrapper(getUsersOfClub));
clubApi.post('/user/:userId/approve', catchExpressJsErrorWrapper(approveUserJoinRequest));
clubApi.delete('/user/:userId', catchExpressJsErrorWrapper(removeUser));
