import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper } from '../utils';
import { getAllInstructorsFromSpreadsheet, getAllRiggersFromSpreadsheet } from 'core/certificates';

export const getAllInstructorCertificates = async (req: Request, res: Response) => {
  const instructors = await getAllInstructorsFromSpreadsheet();
  res.json({ items: instructors });
};

export const getAllRiggerCertificates = async (req: Request, res: Response) => {
  const riggers = await getAllRiggersFromSpreadsheet();
  res.json({ items: riggers });
};

export const certificateApi = express.Router();
certificateApi.get('/instructors', catchExpressJsErrorWrapper(getAllInstructorCertificates));
certificateApi.get('/riggers', catchExpressJsErrorWrapper(getAllRiggerCertificates));
