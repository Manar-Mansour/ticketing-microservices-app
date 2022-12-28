import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus
} from '@manar-mansour-org/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete
    });
    await order.save();
    //normally we should publish an event that says order updated so that the version counts, but we don't expect any serive to try to update the order after it's complete
    msg.ack();
  }
}
