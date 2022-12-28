import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@manar-mansour-org/common';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      //In this case, we do not need to check to see if the length is valid because our validation rules or exactly what a password is might change over time.It might be that at some point in the past we allowed passwords all the way up to 30 characters, whereas now the limit or the maximum is 20.
      .notEmpty() //require that a password is supplied.
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials'); //we use the general bad request error because we don't want to provide much information in case it's a malicious user
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    //Generate JWT
    const userJwt = jwt.sign(
      {
        //The password is hashed and salted but still we don't want to share it with the world in the jwt token
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY! //the exclamation mark tells typescript not to worry about this environment variable and that it is defined
    );
    //Store it on session object
    req.session = {
      jwt: userJwt
    };
    res.status(200).send(existingUser); //200 because we are not creating a new user
  }
);

export { router as signinRouter };
