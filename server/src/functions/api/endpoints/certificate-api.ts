import { isaToolsApi } from 'core/external-api/isa-tools-api';
import express, { Request } from 'express';

import { expressRoute, validateUserExists } from '../utils';

export const getAllCertificates = async (req: Request) => {
  const certificates = await isaToolsApi.listCertificates(req.user.isaId, req.user.email);
  return certificates;
};

export const generateCertificate = async (req: Request) => {
  const { name, surname } = await validateUserExists(req.user.isaId);

  const response = await isaToolsApi.generateCertificate({
    certificateType: req.body.certificateType,
    certificateId: req.body.certificateId,
    subject: `${name} ${surname}`,
    language: req.body.language,
  });
  return response;
};

export const certificateApi = express.Router();
certificateApi.get('/all', expressRoute(getAllCertificates));
certificateApi.put('/generate', expressRoute(generateCertificate));
