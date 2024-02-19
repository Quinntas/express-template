import {Spectre} from "spectre-orm";
import {Primitive} from "../../types/primitives";
import {RedisClient} from "../../utils/redisClient";
import {hashString} from "../../utils/encryption";

interface QueryExecutor {
    query: string;
    params: Primitive[];

    spectreInstance: Spectre

    cache?: {
        key?: string;
        expireTime?: number;
        redisInstance: RedisClient;
    }
}

async function handleCache(queryExecutor: QueryExecutor) {
    const key = queryExecutor.cache.key || hashString(queryExecutor.query);

    const cachedResult = await queryExecutor.cache.redisInstance.get(key);

    if (cachedResult && typeof cachedResult === 'string')
        return JSON.parse(cachedResult);

    const result = await executeQuery({
        query: queryExecutor.query,
        params: queryExecutor.params,
        spectreInstance: queryExecutor.spectreInstance
    });

    await queryExecutor.cache.redisInstance.set(key, JSON.stringify(result), queryExecutor.cache.expireTime);

    return result;
}

export async function executeQuery(queryExecutor: QueryExecutor) {
    if (queryExecutor.cache)
        return await handleCache(queryExecutor);

    return await queryExecutor.spectreInstance.strategy.rawQuery({
        query: queryExecutor.query,
        values: queryExecutor.params
    });
}