import { Listener } from '@manar-mansour-org/common';
import { OrderCreatedEvent } from '@manar-mansour-org/common/build/events/order-created-event';
import { Subjects } from '@manar-mansour-org/common/build/events/subjects';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); //the difference between the expiry time of the order in the future and the current time
    console.log('Waiting this many milliseconds to process the job:', delay);
    await expirationQueue.add(
      {
        orderId: data.id
      },
      {
        delay
      }
    );
    msg.ack();
  }
}
