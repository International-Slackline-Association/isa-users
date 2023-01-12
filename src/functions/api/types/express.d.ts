import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        isaId: string;
        email: string;
        scope: string;
        sub: string;
      };
    }
  }
}
