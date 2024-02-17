import {RedisClient} from "../../utils/redisClient";
import {env} from "../../utils/env";

export const redisClient = new RedisClient(env.REDIS_URL)