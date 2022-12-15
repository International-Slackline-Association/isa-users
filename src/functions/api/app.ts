import { default as express, Express, urlencoded, json } from 'express';
import cors from 'cors';

import { injectCommonlyUsedHeadersMiddleware, errorMiddleware, notFoundMiddleware } from '@functions/api/middlewares';
import { userApi } from '@functions/api/endpoints/user-api';
import { organizationApi } from '@functions/api/endpoints/organization-api';
import { certificateApi } from '@functions/api/endpoints/certificate-api';

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
  app.use('/user', userApi);
  app.use('/organization', organizationApi);
  app.use('/certificate', certificateApi);
};

const registerStartingMiddlewares = (app: Express) => {
  app.use(injectCommonlyUsedHeadersMiddleware);
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
