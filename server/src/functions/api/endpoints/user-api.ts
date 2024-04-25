import * as db from 'core/db';
import { UpdateProfilePicturePostBody, UpdateUserPostBody } from '@functions/api/endpoints/types';
import { assignExistingFields } from 'core/utils';
import { processAndPutProfilePhoto } from 'core/utils/images-processing';
import express, { Request } from 'express';

import { expressRoute, validateUserExists } from '../utils';

export const getUserDetails = async (req: Request) => {
  const user = await db.getUser(req.user.isaId);
  return user;
};

export const updateUser = async (req: Request<any, any, UpdateUserPostBody>) => {
  const { name, surname, birthDate, city, country, emergencyContact, gender, phoneNumber } =
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
  });
  await db.putUser(updatedUser);
  return {};
};

export const updateUserProfilePicture = async (
  req: Request<any, any, UpdateProfilePicturePostBody>,
) => {
  const user = await validateUserExists(req.user.isaId);
  if (!req.body.processingBucketKey) {
    delete user.profilePictureS3Key;
    await db.putUser(user);
  } else {
    const { s3Key } = await processAndPutProfilePhoto(req.body.processingBucketKey, req.user.isaId);
    user.profilePictureS3Key = s3Key;
    await db.putUser(user);
  }
  return {};
};

export const userApi = express.Router();
userApi.get('/details', expressRoute(getUserDetails));
userApi.put('/details', expressRoute(updateUser));
userApi.put('/profilePicture', expressRoute(updateUserProfilePicture));
