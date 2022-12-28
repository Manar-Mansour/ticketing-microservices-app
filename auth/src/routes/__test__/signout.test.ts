//import request from 'supertest';
import supertest from 'supertest';
import { app } from '../../app';
const request = supertest(app);

it('clears the cookie after signing out', async () => {
  await request
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request
    .post('/api/users/signout')
    .send({}) //it is a post request
    .expect(200);
  //console.log(response.get('Set-Cookie'));
  expect(response.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
