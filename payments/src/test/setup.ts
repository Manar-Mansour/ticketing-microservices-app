import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

const request = supertest(app);

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');
jest.mock('../stripe');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //optional userId provided
  //Build a JWT payload. {id, email}
  const payload = {
    //if provided an id then use it, otherwise use the random generated mongoose id
    id: id || new mongoose.Types.ObjectId().toHexString(), //to have a different user each time
    email: 'test@test.com'
  };
  //Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session Object. {jwt:MY_JWT}
  const session = { jwt: token };
  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return a string that is the cookie with the encoded data
  return [`session=${base64}`]; //supertest expects us to include all our cookies in an array
};
