import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        isaId: string;
        email: string;
        sub: string;
      };
    }
  }
}
