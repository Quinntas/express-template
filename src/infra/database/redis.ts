import {env} from '../../utils/env';
import {RedisClient} from '../../utils/redisClient';

export const redisClient = new RedisClient(env.REDIS_URL);
