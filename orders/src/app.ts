import express from 'express';
import 'express-async-errors'; //to use throw error inside async route handlers
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser
} from '@manar-mansour-org/common';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

const app = express();
//we are just adding in this little step right here to make sure that Express is aware
//that it's behind a proxy of Ingress Nginx, and to make sure that it should still trust traffic as
//being secure, even though it's coming from that proxy.
app.set('trust proxy', true);
app.use(express.json());
app.use(
  //cookieSession is a middleware
  cookieSession({
    signed: false, //no encryption of cookie
    secure: false
  })
);
app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
  //.all to watch for all request types for a route that doesn't exist
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
