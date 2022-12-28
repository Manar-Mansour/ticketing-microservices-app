import express from 'express';
import { currentUser } from '@manar-mansour-org/common';

const router = express.Router();

//a route to figure out whether the user is signed in to the application
router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null }); //in case of undefined currentUser, we send back null
});

export { router as currentUserRouter };
