//import request from 'supertest';
import supertest from 'supertest';
import { app } from '../../app';
const request = supertest(app);

it('return a 201 on successful signup', async () => {
  return request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', () => {
  return request
    .post('/api/users/signup')
    .send({
      email: 'fergrthryjtyre', //invalid email
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', () => {
  return request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com', //invalid email
      password: 'p' //invalid password
    })
    .expect(400);
});

it('returns a 400 with missing email and password', () => {
  return request.post('/api/users/signup').send({}).expect(400);
});

it('disallows duplicate emails', async () => {
  await request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  await request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
