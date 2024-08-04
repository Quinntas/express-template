import {env} from '../../common/env';
import {RedisClient} from '../../services/internal/clients/redisClient';

export const cacheService = new RedisClient(env.REDIS_URL);
