import {
  Publisher,
  Subjects,
  TicketCreatedEvent
} from '@manar-mansour-org/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
