import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateUserExists } from '../utils';
import {
  getInstructorsFromSpreadsheet,
  getAllUserCertificatesFromSpreadsheet,
  getRiggersFromSpreadsheet,
  getWorldRecordsFromSpreadsheet,
} from 'core/certificates';
import { createVerifiableDocument } from 'core/documentVerification';

export const getAllCertificates = async (req: Request, res: Response) => {
  const certificates = await getAllUserCertificatesFromSpreadsheet(req.user.isaId, req.user.email);
  res.json({ items: certificates });
};

export const getInstructorCertificateDocument = async (req: Request, res: Response) => {
  const { name, surname } = await validateUserExists(req.user.isaId);
  const cert = (await getInstructorsFromSpreadsheet(req.params.certId))[0];
  const [day, month, year] = cert.endDate.split('.').map((c) => parseInt(c));
  const expiresInSeconds = Math.floor((new Date(year, month - 1, day).getTime() - new Date().getTime()) / 1000);

  const { verificationUrl } = await createVerifiableDocument({
    subject: `${name} ${surname}`,
    expiresInSeconds: expiresInSeconds,
    createHash: true,
    content: `"${cert.name} ${cert.surname}" has a valid "${cert.level}" certificate valid until "${cert.endDate}"`,
  });
  res.json({ verificationUrl });
};

export const getRiggerCertificateDocument = async (req: Request, res: Response) => {
  const { name, surname } = await validateUserExists(req.user.isaId);
  const cert = (await getRiggersFromSpreadsheet(req.params.certId))[0];
  const [day, month, year] = cert.endDate.split('.').map((c) => parseInt(c));
  const expiresInSeconds = Math.floor((new Date(year, month - 1, day).getTime() - new Date().getTime()) / 1000);

  const { verificationUrl } = await createVerifiableDocument({
    subject: `${name} ${surname}`,
    expiresInSeconds: expiresInSeconds,
    createHash: true,
    content: `"${cert.name} ${cert.surname}" has a valid "${cert.level}" certificate valid until "${cert.endDate}"`,
  });
  res.json({ verificationUrl });
};

export const getWorldRecordCertificateDocument = async (req: Request, res: Response) => {
  const { name, surname } = await validateUserExists(req.user.isaId);
  const cert = (await getWorldRecordsFromSpreadsheet(req.params.certId))[0];

  const { verificationUrl } = await createVerifiableDocument({
    subject: `${name} ${surname}`,
    expiresInSeconds: 60 * 60 * 24 * 365 * 1, // 1 year
    createHash: true,
    content: `"${cert.name}" has a valid world record certificate for "${cert.recordType}" with specs "${cert.specs}"`,
  });
  res.json({ verificationUrl });
};

export const certificateApi = express.Router();
certificateApi.get('/all', catchExpressJsErrorWrapper(getAllCertificates));
certificateApi.get('/instructor/:certId/document', catchExpressJsErrorWrapper(getInstructorCertificateDocument));
certificateApi.get('/rigger/:certId/document', catchExpressJsErrorWrapper(getRiggerCertificateDocument));
certificateApi.get('/world-record/:certId/document', catchExpressJsErrorWrapper(getWorldRecordCertificateDocument));
