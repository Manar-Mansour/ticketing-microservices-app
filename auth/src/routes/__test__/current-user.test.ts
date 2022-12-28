//import request from 'supertest';
import supertest from 'supertest';
import { app } from '../../app';
const request = supertest(app);

it('responds with details about the current user', async () => {
  // const authResponse = await request
  //   .post('/api/users/signup')
  //   .send({
  //     email: 'test@test.com',
  //     password: 'password'
  //   })
  //   .expect(201);
  // const cookie = authResponse.get('Set-Cookie');
  const cookie = await signin();
  const response = await request
    .get('/api/users/currentuser')
    .set('Cookie', cookie) //set is used to set different headers like Cookie
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request
    .get('/api/users/currentuser')
    .send()
    .expect(200); //we should get 200 even if we are not authenticated

  expect(response.body.currentUser).toEqual(null);
});
