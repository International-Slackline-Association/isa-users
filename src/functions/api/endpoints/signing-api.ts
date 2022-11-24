import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateUserExists } from '../utils';
import * as db from 'core/db';
import { SignPayloadBody } from '@functions/api/endpoints/types';
import { signJWT } from 'core/utils/crypto';
import { DDBGenericHashItem } from 'core/db/genericHash/types';
import { hashValue } from 'core/utils';
import { putHash } from 'core/db/genericHash';

export const signPayload = async (req: Request<any, any, SignPayloadBody>, res: Response) => {
  const { payload, expiresInSeconds } = req.body;
  const user = await validateUserExists(req.user.isaId);
  const token = await signJWT(payload, {
    expiresIn: expiresInSeconds,
    subject: user.name + user.surname ? ` ${user.surname}` : '',
    issuer: 'account.slacklineinternational.org',
  });
  const hash: DDBGenericHashItem = {
    hash: hashValue(token),
    ddb_ttl: Math.round(Date.now() / 1000) + expiresInSeconds,
    value: token,
  };
  await putHash(hash);
  res.end({ verificationHash: hash, verificationToken: token });
};

export const signingApi = express.Router();
signingApi.put('/', catchExpressJsErrorWrapper(signPayload));
