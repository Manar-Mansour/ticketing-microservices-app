import express from 'express';
import 'express-async-errors'; //to use throw error inside async route handlers
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@manar-mansour-org/common';

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
    secure: process.env.NODE_ENV !== 'test' //cookie will only be used if user is visiting the app over HTTPS connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  //.all to watch for all request types for a route that doesn't exist
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
