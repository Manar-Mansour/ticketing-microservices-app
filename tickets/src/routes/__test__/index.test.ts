//import request from 'supertest';
import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);
const createTicket = () => {
  return request.post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'valid title',
    price: 20
  });
};
it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request.get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(3);
});
