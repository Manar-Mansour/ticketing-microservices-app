import {
  Subjects,
  Publisher,
  PaymentCreatedEvent
} from '@manar-mansour-org/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
