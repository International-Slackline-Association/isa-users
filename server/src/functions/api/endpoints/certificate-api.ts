import { isaDocumentApi } from 'core/external-api/isa-documents-api';
import express, { Request, Response } from 'express';

import { catchExpressJsErrorWrapper, validateUserExists } from '../utils';

export const getAllCertificates = async (req: Request, res: Response) => {
  const certificates = await isaDocumentApi.listCertificates(req.user.isaId, req.user.email);
  res.json(certificates);
};

export const generateCertificate = async (req: Request, res: Response) => {
  const { name, surname } = await validateUserExists(req.user.isaId);

  const response = await isaDocumentApi.generateCertificate({
    certificateType: req.body.certificateType,
    certificateId: req.body.certificateId,
    subject: `${name} ${surname}`,
    language: req.body.language,
  });
  res.json(response);
};

export const certificateApi = express.Router();
certificateApi.get('/all', catchExpressJsErrorWrapper(getAllCertificates));
certificateApi.put('/generate', catchExpressJsErrorWrapper(generateCertificate));
