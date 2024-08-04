import {env} from '../../common/env';
import {RabbitMQClient} from '../../services/internal/clients/rmqClient';

export const eventService = new RabbitMQClient(env.RMQ_URL);
