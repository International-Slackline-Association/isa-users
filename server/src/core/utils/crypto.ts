import { GetParametersCommand } from '@aws-sdk/client-ssm';
import { ssm } from 'core/aws/clients';
import jwt, { SignOptions } from 'jsonwebtoken';

import publicKey from '../__static/verificationPublicKey';

const jwtSecretSSMParameter = 'isa-users-rsa-private-key';

export const signJWT = async (payload: Record<string, any>, opts: SignOptions) => {
  const ssmParam = await ssm.send(new GetParametersCommand({ Names: [jwtSecretSSMParameter] }));
  const jwtPrivateKey = ssmParam.Parameters[0].Value;

  const token = jwt.sign(payload, jwtPrivateKey, { ...opts, algorithm: 'RS256' });
  return token;
};

export const verifyJWT = (token: string) => {
  const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  return payload;
};
