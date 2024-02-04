import {Spectre} from "spectre-orm";
import {Primitive} from "../../types/primitives";
import {RedisClient} from "../../utils/redisClient";

interface QueryExecutor {
    query: string;
    params: Primitive[];

    spectreInstance: Spectre

    cache?: {
        key?: string;
        redisInstance: RedisClient;
    }
}

export async function executeQuery(queryExecutor: QueryExecutor) {
    return await queryExecutor.spectreInstance.strategy.rawQuery({
        query: queryExecutor.query,
        values: queryExecutor.params
    });
}