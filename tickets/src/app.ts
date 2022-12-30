import express from 'express';
import 'express-async-errors'; //to use throw error inside async route handlers
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser
} from '@manar-mansour-org/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', () => {
  //.all to watch for all request types for a route that doesn't exist
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
