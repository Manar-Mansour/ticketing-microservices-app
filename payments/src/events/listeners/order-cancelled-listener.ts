import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects
} from '@manar-mansour-org/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      //we might want to extract this into a separate function inside the model file as we did before
      _id: data.id,
      version: data.version - 1
    });
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
