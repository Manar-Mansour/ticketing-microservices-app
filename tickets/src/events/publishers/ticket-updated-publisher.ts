import {
  Publisher,
  Subjects,
  TicketUpdatedEvent
} from '@manar-mansour-org/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
