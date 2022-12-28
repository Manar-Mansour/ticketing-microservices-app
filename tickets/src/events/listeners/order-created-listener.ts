import {
  Listener,
  OrderCreatedEvent,
  Subjects
} from '@manar-mansour-org/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
//import { natsWrapper } from '../../nats-wrapper';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Reach to ticket collection and find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    //Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id }); //the id of the order that was just created
    //Save the ticket
    await ticket.save();
    //this.client instead of natsWrapper.client
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });
    //ack the message
    msg.ack();
  }
}
