import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateClubExists, validateUserExists } from '../utils';
import * as db from 'core/db';
import { UpdateUserPostBody } from '@functions/api/endpoints/types';
import { assignExistingFields } from 'core/utils';

export const getUserDetails = async (req: Request, res: Response) => {
  const user = await db.getUser(req.user.id);
  res.json(user);
};

export const getClubsOfUser = async (req: Request, res: Response) => {
  const userClubs = await db.getClubsOfUser(req.user.id);
  if (userClubs.length > 0) {
    const clubs = await db.getClubs(userClubs.map((c) => c.clubId));
    const items = clubs
      .map((c) => {
        const userClub = userClubs.find((u) => u.clubId === c.clubId);
        return {
          ...c,
          ...userClub,
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
  const user = await validateUserExists(req.user.id);
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

export const joinClub = async (req: Request, res: Response) => {
  const clubId = req.params.id;
  const { userId } = await validateUserExists(req.user.id);
  const club = await validateClubExists(clubId);
  const userClub = await db.getUserClub(userId, clubId);
  if (!userClub) {
    await db.putUserClub({
      clubId: clubId,
      userId: userId,
      isPendingApproval: true,
      joinedAt: new Date().toISOString(),
    });
  }
  // TODO: Send email to club
  res.end();
};

export const leaveClub = async (req: Request, res: Response) => {
  const clubId = req.params.id;
  await db.removeUserClub(req.user.id, clubId);
  // TODO: Send email to club
  res.end();
};

export const userApi = express.Router();
userApi.get('/details', catchExpressJsErrorWrapper(getUserDetails));
userApi.put('/details', catchExpressJsErrorWrapper(updateUser));
userApi.get('/clubs', catchExpressJsErrorWrapper(getClubsOfUser));
userApi.post('/club/:id/join', catchExpressJsErrorWrapper(joinClub));
userApi.delete('/club/:id', catchExpressJsErrorWrapper(leaveClub));
