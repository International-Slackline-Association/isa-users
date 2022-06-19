import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { getCurrentInvoke } from '@vendia/serverless-express';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from 'core/logger';

export const injectCommonlyUsedHeadersMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const event = getCurrentInvoke().event as APIGatewayProxyEvent;
  const claims = event.requestContext.authorizer?.claims;
  if (claims) {
    req.user = {
      email: claims.email,
      sub: claims.sub,
    };
  }
  next();
};

export const errorMiddleware: ErrorRequestHandler = async (error, req, res, next) => {
  if (!error) {
    next();
    return;
  }
  const message = error.message || 'Error occurred';
  const stack = error.stack;

  logger.error(message, {
    httpRequest: { path: req.path, body: req.body, method: req.method },
    stack,
  });
  res.status(500).json({
    status: 500,
    message,
    stack,
  });
};

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: '404 Not Found' });
};
