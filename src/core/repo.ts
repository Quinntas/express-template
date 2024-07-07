import {InferInsertModel, SQL} from 'drizzle-orm';
import {MySql2Database, MySqlQueryResult} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {SelectedFields} from 'drizzle-orm/mysql-core/query-builders/select.types';
import {Err, Ok, Result} from 'ts-results';
import {RedisClient} from '../services/internal/clients/redisClient';
import {MapperError, RepoError, RepoErrorBody, RepoErrorCodes} from './errors';
import {Mapper} from './mapper';
import {Domain as DomainType} from './types/domain';
import {UnknownObject} from './types/json';

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

        console.log(this.redisClient);
    }

    async selectOne<T = typeof this.table>(config: SelectOptions<T>): Promise<Result<Required<Domain>, RepoError | MapperError>> {
        const res = await this.select(config);
        if (!res.ok) return Err(res.val);
        if (res.val.length === 0) return Err(new RepoError('No record was found.', undefined, RepoErrorCodes.ER_NO_RECORD));
        const mapped = this.mapper.toDomain(res.val[0]);
        if (!mapped.ok) return Err(mapped.val);
        return Ok(mapped.val);
    }

    async selectMany<T = typeof this.table>(config: SelectOptions<T>): Promise<Result<Required<Domain[]>, RepoError | MapperError>> {
        const res = await this.select(config);
        if (!res.ok) return Err(res.val);
        if (res.val.length === 0) return Err(new RepoError('No record was found.', undefined, RepoErrorCodes.ER_NO_RECORD));
        const mapped = this.mapper.rawToDomainList(res.val);
        if (!mapped.ok) return Err(mapped.val);
        return Ok(mapped.val);
    }

    async select<T = typeof this.table>(config: SelectOptions<T>): Promise<Result<UnknownObject[], RepoError>> {
        let query;

        if (config.select) query = this.readConn.select(config.select);
        else query = this.readConn.select();

        query = query.from(this.table).where(config.where);

        try {
            return Ok<UnknownObject[]>(await query.execute());
        } catch (e: unknown) {
            return Err(new RepoError('Error selecting records.', e as RepoErrorBody));
        }
    }

    /**
     * Inserts a new record into the database table.
     * @param values
     */
    async insert(values: InferInsertModel<typeof this.table>): Promise<Result<MySqlQueryResult, RepoError>> {
        try {
            return Ok(await this.writeConn.insert(this.table).values(values).execute());
        } catch (e: unknown) {
            return Err(new RepoError('Error inserting record.', e as RepoErrorBody));
        }
    }

    /**
     * Updates a record in the database table.
     * @param where
     * @param values
     */
    async update<T = typeof this.table>(where: SQL<T>, values: Partial<Domain>): Promise<Result<MySqlQueryResult, RepoError>> {
        try {
            return Ok(await this.writeConn.update(this.table).set(values).where(where).execute());
        } catch (e: unknown) {
            return Err(new RepoError('Error updating record.', e as RepoErrorBody));
        }
    }
}
