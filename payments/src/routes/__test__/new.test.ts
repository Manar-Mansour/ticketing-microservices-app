import mongoose, { mongo } from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@manar-mansour-org/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

const request = supertest(app);

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'sjhjfsd',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();
  await request
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'sjhjfsd',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();
  await request
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'sjhjfsd',
      orderId: order.id
    })
    .expect(400);
});
//HTTP Status 204 (No Content) indicates that the server has successfully fulfilled the request and that there is no content to send in the response payload body
it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();
  const response = await request
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa', //works for stripe accounts in the test mode
      orderId: order.id
    })
    .expect(201);
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: response.body.id
  });
  expect(payment).not.toBeNull();
});
