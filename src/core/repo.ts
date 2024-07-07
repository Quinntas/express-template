import {InferInsertModel, SQL} from 'drizzle-orm';
import {MySql2Database} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {SelectedFields} from 'drizzle-orm/mysql-core/query-builders/select.types';
import {RedisClient} from '../services/internal/clients/redisClient';
import {Mapper} from './mapper';
import {Domain as DomainType} from './types/domain';

interface CachingOptions {
    key: string;
    expires: number;
}

interface SelectOptions<T> {
    where: SQL<T>;
    select?: SelectedFields;
    cachingOptions?: CachingOptions;
}

/**
 * Base repository class for interacting with a database table.
 * @template Domain - The domain entity type.
 */
export abstract class Repo<Domain extends DomainType<any>> {
    private readonly table: MySqlTable;
    private readonly readConn: MySql2Database;
    private readonly writeConn: MySql2Database;
    private readonly mapper: Mapper<Domain>;
    private readonly redisClient: RedisClient;

    protected constructor(table: MySqlTable, readConn: MySql2Database, writeConn: MySql2Database, mapper: Mapper<Domain>, redisClient: RedisClient) {
        this.table = table;
        this.readConn = readConn;
        this.writeConn = writeConn;
        this.mapper = mapper;
        this.redisClient = redisClient;
    }

    async selectOne<T = typeof this.table>(config: SelectOptions<T>): Promise<Required<Domain> | null> {
        const res = await this.select(config);
        if (!res || res.length == 0) return null;
        return this.mapper.toDomain(res[0]);
    }

    async selectMany<T = typeof this.table>(config: SelectOptions<T>): Promise<Domain[] | null> {
        const res = await this.select(config);
        if (!res || res.length == 0) return null;
        return this.mapper.rawToDomainList(res);
    }

    select<T = typeof this.table>(
        config: SelectOptions<T>,
    ): Promise<
        {
            [p: string]: unknown;
        }[]
    > {
        if (config.cachingOptions)
            return this.redisClient.cacheIt<{[p: string]: unknown}[]>({
                ...config.cachingOptions,
                serialize: JSON.stringify,
                deserialize: JSON.parse,
                generator: () =>
                    this.select({
                        where: config.where,
                        select: config.select,
                    }),
            });
        return this.readConn
            .select(config.select ?? {})
            .from(this.table)
            .where(config.where)
            .execute();
    }

    /**
     * Inserts a new record into the database table.
     * @param values
     */
    async insert(values: InferInsertModel<typeof this.table>) {
        return this.writeConn.insert(this.table).values(values).execute();
    }

    /**
     * Updates a record in the database table.
     * @param where
     * @param values
     */
    update<T = typeof this.table>(where: SQL<T>, values: Partial<Domain>) {
        return this.writeConn.update(this.table).set(values).where(where).execute();
    }
}
