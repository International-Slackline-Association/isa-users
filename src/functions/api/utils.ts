import { Request, Response } from 'express';

export const catchExpressJsErrorWrapper = (f: (req: Request, res: Response, next?) => Promise<any>) => {
  return (req: Request, res: Response, next) => {
    f(req, res, next).catch(next);
  };
};
