//import request from 'supertest';
import supertest from 'supertest';
import { app } from '../../app';
const request = supertest(app);

it('fails when an email that does not exist is supplied', async () => {
  await request
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'jkdjfrefgjr'
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
