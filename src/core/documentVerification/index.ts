import { getHash, putHash } from 'core/db/genericHash';
import { DDBGenericHashItem } from 'core/db/genericHash/types';
import { hashValue } from 'core/utils';
import { signJWT, verifyJWT } from 'core/utils/crypto';
import { JwtPayload } from 'jsonwebtoken';
import dateFormat from 'dateformat';

export interface VerifiableDocumentPayload {
  content: string;
}

export const generateVerificationUrl = (id?: string, token?: string) => {
  const base = 'https://verify.slacklineinternational.org/document';
  if (id) {
    return `${base}?id=${id}`;
  }
  if (token) {
    return `${base}?token=${token}`;
  }
  return undefined;
};

export const createVerifiableDocument = async (document: {
  expiresInSeconds: number;
  subject: string;
  content: string;
  createHash?: boolean;
}) => {
  const { content, expiresInSeconds, subject, createHash } = document;
  const payload: VerifiableDocumentPayload = {
    content,
  };
  const token = await signJWT(
    { payload },
    {
      expiresIn: expiresInSeconds,
      subject: subject,
      issuer: 'account.slacklineinternational.org',
    },
  );

  let id: string;
  if (createHash) {
    const hash: DDBGenericHashItem = {
      hash: hashValue(token),
      ddb_ttl: Math.round(Date.now() / 1000) + expiresInSeconds,
      value: token,
    };
    await putHash(hash);
    id = hash.hash;
  }
  return {
    id,
    token,
    verificationUrl: generateVerificationUrl(id, token),
    expiresAt: dateFormat(Date.now() + expiresInSeconds * 1000, 'longDate'),
  };
};

export const getVerifiableDocument = async (id?: string, token?: string) => {
  let signedContent = token;
  if (id) {
    const hash = await getHash(id);
    if (!hash) {
      throw new Error('NotFound');
    }
    signedContent = hash.value;
  }
  if (!signedContent) {
    throw new Error('NotFound');
  }
  try {
    const { iss, payload, iat, exp, sub } = verifyJWT(signedContent) as JwtPayload;
    return {
      issuer: iss,
      subject: sub,
      payload: payload as VerifiableDocumentPayload,
      issuedAt: dateFormat(new Date(iat * 1000), 'longDate'),
      expiresAt: dateFormat(new Date(exp * 1000), 'longDate'),
    };
  } catch (error) {
    if (error.message === 'jwt expired') {
      throw new Error('Expired');
    }
    throw new Error('Invalid');
  }
};
