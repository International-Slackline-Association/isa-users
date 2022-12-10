import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper } from '../utils';
import { getAllUserCertificatesFromSpreadsheet } from 'core/certificates';

export const getAllCertificates = async (req: Request, res: Response) => {
  const certificates = await getAllUserCertificatesFromSpreadsheet(req.user.isaId, req.user.email);
  res.json({ items: certificates });
};

export const certificateApi = express.Router();
certificateApi.get('/all', catchExpressJsErrorWrapper(getAllCertificates));
