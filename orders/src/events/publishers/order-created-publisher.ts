import {
  Publisher,
  OrderCreatedEvent,
  Subjects
} from '@manar-mansour-org/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
