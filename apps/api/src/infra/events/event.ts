import {Event} from '../../lib/event';
import {eventService} from '../connections/event';
import {eventRouter} from '../routers/event.router';

export const event: Event<typeof eventRouter> = new Event<typeof eventRouter>('@domainEvents', eventRouter, eventService);
