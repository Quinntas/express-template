import {Ok} from 'ts-results';
import {EventDTO} from '../../../../../lib/types/event';
import {log} from '../../../../shared/infra/log';
import {UserCreatedEventDto} from './userCreated.event.dto';

export async function userCreatedEvent(payload: EventDTO<UserCreatedEventDto>) {
    log.info(`User created`);
    log.debug(payload.data);
    return Ok.EMPTY;
}
