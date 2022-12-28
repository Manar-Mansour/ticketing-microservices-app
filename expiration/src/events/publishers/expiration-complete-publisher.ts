import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@manar-mansour-org/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
