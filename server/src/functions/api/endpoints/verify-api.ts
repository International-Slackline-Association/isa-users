import { AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cisProvider } from 'core/aws/clients';
import { isaToolsApi } from 'core/external-api/isa-tools-api';
import express, { Request, Response } from 'express';

import { expressRoute } from '../utils';

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  const { content, isVerified } = await isaToolsApi.verifySignedDocument(token);

  if (isVerified) {
    const { username, email } = JSON.parse(content);
    await cisProvider.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.USERPOOL_ID,
        Username: username,
        UserAttributes: [
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
      }),
    );
    res.send(`<html><body><h3>${email} has been verified.</h3></body></html>`);
    return;
  }

  res.send(`<html><body><h3>Verification failed</h3></body></html>`);
  return;
};

export const verifyApi = express.Router();
verifyApi.get('/confirm-email', expressRoute(verifyEmail));
