import {env} from '../../common/env';
import {RabbitMQClient} from '../../services/internal/clients/rmqClient';

export const rmqClient = new RabbitMQClient(env.RMQ_URL);
