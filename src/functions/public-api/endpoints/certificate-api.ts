import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper } from '../utils';
import { getInstructorsFromSpreadsheet, getRiggersFromSpreadsheet } from 'core/certificates';

export const getAllInstructorCertificates = async (req: Request, res: Response) => {
  const instructors = await getInstructorsFromSpreadsheet();
  res.json({ items: instructors });
};

export const getAllRiggerCertificates = async (req: Request, res: Response) => {
  const riggers = await getRiggersFromSpreadsheet();
  res.json({ items: riggers });
};

export const certificateApi = express.Router();
certificateApi.get('/instructors', catchExpressJsErrorWrapper(getAllInstructorCertificates));
certificateApi.get('/riggers', catchExpressJsErrorWrapper(getAllRiggerCertificates));
