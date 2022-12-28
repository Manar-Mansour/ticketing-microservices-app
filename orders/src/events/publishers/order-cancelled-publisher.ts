import {
  Publisher,
  OrderCancelledEvent,
  Subjects
} from '@manar-mansour-org/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
