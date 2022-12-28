import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';
console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');
  //whenver an interrupt or terminate signal is received
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  new TicketCreatedListener(stan).listen();
});
process.on('SIGINT', () => stan.close()); //interrupt signal
process.on('SIGTERM', () => stan.close()); //terminate signal
