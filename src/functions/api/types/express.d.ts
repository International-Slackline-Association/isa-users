import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        // email: string;
        // sub: string;
      };
    }
  }
}
