import {InferInsertModel, SQL} from 'drizzle-orm';
import {MySql2Database, MySqlQueryResult} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {SelectedFields} from 'drizzle-orm/mysql-core/query-builders/select.types';
import {RedisClient} from '../services/internal/clients/redisClient';
import {Mapper} from './mapper';
import {Domain as DomainType} from './types/domain';
import {UnknownObject} from './types/json';
import {Err, Ok, Result} from "ts-results";

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

    async selectOne<T = typeof this.table>(config: SelectOptions<T>): Promise<Result<Required<Domain>, Error>> {
        const res = await this.select(config);
        if (!res.ok) return Err(new Error('Records not found.'));
        return Ok<Required<Domain>>(this.mapper.toDomain(res.unwrap()[0]));
    }

    async selectMany<T = typeof this.table>(config: SelectOptions<T>): Promise<Result<Required<Domain[]>, Error>> {
        const res = await this.select(config);
        if (!res.ok) return Err(new Error('Records not found.'));
        return Ok<Required<Domain[]>>(this.mapper.rawToDomainList(res.unwrap()));
    }

    async select<T = typeof this.table>(config: SelectOptions<T>): Promise<Result<UnknownObject[], Error>> {
        if (config.cachingOptions) {
            const res = await this.redisClient.cacheIt<Result<UnknownObject[], Error>>({
                ...config.cachingOptions,
                serialize: JSON.stringify,
                deserialize: JSON.parse,
                generator: () => this.select({
                    where: config.where,
                    select: config.select,
                }),
            })

            return Ok<UnknownObject[]>(res.unwrap());
        }

        try {
            return Ok<UnknownObject[]>(await this.readConn
                .select(config.select ?? {})
                .from(this.table)
                .where(config.where)
                .execute());
        } catch (e: unknown) {
            return Err(e as Error);
        }
    }

    /**
     * Inserts a new record into the database table.
     * @param values
     */
    async insert(values: InferInsertModel<typeof this.table>): Promise<Result<MySqlQueryResult, Error>> {
        try {
            return Ok<MySqlQueryResult>(await this.writeConn.insert(this.table).values(values).execute());
        } catch (e: unknown) {
            return Err(e as Error);
        }
    }

    /**
     * Updates a record in the database table.
     * @param where
     * @param values
     */
    async update<T = typeof this.table>(where: SQL<T>, values: Partial<Domain>): Promise<Result<MySqlQueryResult, Error>> {
        try {
            return Ok(await this.writeConn.update(this.table).set(values).where(where).execute());
        } catch (e: unknown) {
            return Err(e as Error);
        }
    }
}
