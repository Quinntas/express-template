import {Result} from 'ts-results';
import {CacheItConfig} from '../../services/internal/clients/redisClient';

export type CacheTypes = string | number | Buffer | null;

export abstract class CacheService {
    public abstract cacheIt<T>(config: CacheItConfig<T>): Promise<T>;

    public abstract delete(key: string): Promise<Result<number, void>>;

    public abstract set(
        key: string,
        value: CacheTypes,
        tokenExpiryTime: number,
    ): Promise<Result<void, void>>;

    public abstract get(key: string): Promise<Result<string, void>>;
}
