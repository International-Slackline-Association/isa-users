import { certificateApi } from '@functions/api/endpoints/certificate-api';
import { userApi } from '@functions/api/endpoints/user-api';
import {
  adjustResourcePathParameters,
  errorMiddleware,
  injectCommonlyUsedHeadersMiddleware,
  notFoundMiddleware,
} from '@functions/api/middlewares';
import cors from 'cors';
import { Express, default as express, json, urlencoded } from 'express';

import { basicApi } from './endpoints/basic-api';
import { verifyApi } from './endpoints/verify-api';

const app = express();

const setupExpressApp = (app: Express) => {
  app.use(cors());
  app.use(json());
  app.use(
    urlencoded({
      extended: true,
    }),
  );
};

const setupRoutes = (app: Express) => {
  app.use('/basic', basicApi);
  app.use('/user', userApi);
  app.use('/certificate', certificateApi);
  app.use('/verify', verifyApi);
};

const registerStartingMiddlewares = (app: Express) => {
  app.use(injectCommonlyUsedHeadersMiddleware);
  app.use(adjustResourcePathParameters);
};

const registerEndingMiddlewares = (app: Express) => {
  app.use(errorMiddleware);
  app.use(notFoundMiddleware);
};

setupExpressApp(app);
registerStartingMiddlewares(app);
setupRoutes(app);
registerEndingMiddlewares(app);

export default app;
