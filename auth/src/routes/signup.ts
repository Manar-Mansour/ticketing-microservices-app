import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@manar-mansour-org/common';
import { User } from '../models/user';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
      // console.log('Email in use');
      // return res.send({});
    }
    const user = User.build({ email, password });
    await user.save(); //persist it into mongodb

    //Generate JWT
    const userJwt = jwt.sign(
      {
        //The password is hashed and salted but still we don't want to share it with the world in the jwt token
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY! //the exclamation mark tells typescript not to worry about this environment variable and that it is defined
    );
    //Store it on session object
    req.session = {
      jwt: userJwt
    };
    res.status(201).send(user); //201 creating a new record
  }
);

export { router as signupRouter };
