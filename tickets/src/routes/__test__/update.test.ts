//import request from 'supertest';
import supertest from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

const request = supertest(app);

//404 not found
it('returns a 404 if the provided id does not exist ', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'valid title',
      price: 20
    })
    .expect(404);
});

//401 forbidden/not allowed
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request
    .put(`/api/tickets/${id}`)
    .send({
      title: 'valid title',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'valid title',
      price: 20
    });
  await request
    .put(`/api/tickets/${response.body.id}`) //the id of the ticket created above
    .set('Cookie', global.signin()) //another user than the one created the ticket above
    .send({
      title: 'updated title',
      price: 1000
    })
    .expect(401);

  /*optionally, you could do a follow up request to retrieve details about this ticket and verify that
  it has the same title and the same price just to make sure that the update was truly not processed. */
});

//400 bad request
it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: 20
    });
  //case of invalid title
  await request
    .put(`/api/tickets/${response.body.id}`) //the id of the ticket that was created above
    .set('Cookie', cookie) //I am the same user who created the ticket
    .send({
      title: '',
      price: 20
    })
    .expect(400);
  //case of invalid price
  await request
    .put(`/api/tickets/${response.body.id}`) //the id of the ticket that was created above
    .set('Cookie', cookie) //I am the same user who created the ticket
    .send({
      title: 'valid title',
      price: -10
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: 20
    });
  await request
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  const ticketResponse = await request
    .get(`/api/tickets/${response.body.id}`) //we don't use a cookie because this route does not require authentication
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: 20
    });
  await request
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const response = await request
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: 20
    });
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();
  await request
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(400);
});
