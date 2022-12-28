import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import {
  OrderStatus,
  ExpirationCompleteEvent
} from '@manar-mansour-org/common'; //from the common module

const setup = async () => {
  //create an istance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();
  const order = Order.build({
    userId: 'dmdfhgy',
    status: OrderStatus.Created,
    expiresAt: new Date(), //doesn't really matter here because we are going to expire it anyways in testing
    ticket
  });
  await order.save();
  //build fake data object
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return { ticket, order, listener, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { order, listener, data, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { order, listener, data, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  ); //calls is the array of all the different times this mock function was invoked.
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //write assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
