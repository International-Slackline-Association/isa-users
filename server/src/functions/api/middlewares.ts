import { getCurrentInvoke } from '@codegenie/serverless-express';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from 'core/logger';
import { generateISAIdFromUsername } from 'core/utils';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const adjustResourcePathParameters = (req: Request, res: Response, next: NextFunction) => {
  // Taken from @turinggroup/serverless-express-custom-domain-middleware
  const { event } = getCurrentInvoke();
  const params = event.pathParameters || {};
  const replace_params = (acc, k) => {
    if (k == 'proxy') {
      return acc.replace('{proxy+}', params[k]);
    } else {
      return acc.replace('{' + k + '}', params[k]);
    }
  };

  let interpolated_resource = Object.keys(params).reduce(replace_params, event.resource);
  //covers trailing slash cornercase, since trailing slashes are not returned in event.resource .
  if (event.path.endsWith('/') && !interpolated_resource.endsWith('/')) {
    interpolated_resource = `${interpolated_resource}/`;
  }

  if (!!req.url && !!interpolated_resource && req.url != interpolated_resource) {
    req.url = req.originalUrl = interpolated_resource;
  }

  next();
};

export const injectCommonlyUsedHeadersMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const event = getCurrentInvoke().event as APIGatewayProxyEvent;
  const claims = event.requestContext.authorizer?.claims;
  if (claims) {
    req.user = {
      isaId: claims['cognito:username'] && generateISAIdFromUsername(claims['cognito:username']),
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

export const notFoundMiddleware = (req: Request, res: Response, _next: NextFunction) => {
  const message = `${req.path} Not Found`;
  console.log(message);
  res.status(404).json({ message: `${req.path} Not Found` });
};
