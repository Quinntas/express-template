import {Event} from '../../lib/types/event';
import {rmqClient} from '../connections/rmq';
import {eventRouter} from '../routers/event.router';

export const event: Event<typeof eventRouter> = new Event<typeof eventRouter>('@domainEvents', eventRouter, rmqClient);
