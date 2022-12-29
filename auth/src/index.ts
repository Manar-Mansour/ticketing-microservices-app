import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up auth service.....');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI); //auth-mongo-srv instead of localhost because we are connecting to the mongodb instance in the pod
    //when we put /auth mongoose is going to automatically create a database for us called auth
    console.log('connected to mongodb');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!');
  });
};

start();
