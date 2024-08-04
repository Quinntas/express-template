import {eventService} from './event';

export async function lazyConnections() {
    await eventService.connect();
}
