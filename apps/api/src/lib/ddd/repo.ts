import {ExtractTablesWithRelations, InferInsertModel, SQL} from 'drizzle-orm';
import {
    MySql2Database,
    MySql2PreparedQueryHKT,
    MySql2QueryResultHKT,
    MySqlRawQueryResult,
} from 'drizzle-orm/mysql2';
import {MySqlTable, MySqlTransaction} from 'drizzle-orm/mysql-core';
import {SelectedFields} from 'drizzle-orm/mysql-core/query-builders/select.types';
import {Err, Ok, Result} from 'ts-results';
import {CacheService} from '../services/cacheService';
import {
    MapperError,
    RepoError,
    RepoErrorBody,
    RepoErrorCodes,
} from '../web/errors';
import {UnknownObject} from '../web/json';
import {Domain as DomainType} from './domain';
import {Mapper} from './mapper';

export type Transaction = MySqlTransaction<
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
>;

interface CachingOptions {
    key: string;
    expires: number;
}

interface SelectOptions {
    where: SQL;
    select?: SelectedFields;
    cachingOptions?: CachingOptions;
}

interface InsertOptions<Tables extends MySqlTable> {
    values: InferInsertModel<Tables>;
    transaction?: Transaction;
}

interface UpdateOptions<Domain extends DomainType<any>> {
    where: SQL;
    values: Partial<Domain>;
    transaction?: Transaction;
}

export interface RepoConfig<Domain extends DomainType<any>> {
    table: MySqlTable;
    readConn: MySql2Database;
    writeConn: MySql2Database;
    cacheService: CacheService;
    mapper: Mapper<Domain>;
}

/**
 * Base repository class for interacting with a database table.
 * @template Domain - The domain entity type.
 */
export abstract class Repo<
    Domain extends DomainType<any>,
    Table extends MySqlTable,
> {
    private readonly table: MySqlTable;
    private readonly readConn: MySql2Database;
    private readonly writeConn: MySql2Database;
    private readonly mapper: Mapper<Domain>;
    private readonly cacheService: CacheService;

    protected constructor(cfg: RepoConfig<Domain>) {
        this.table = cfg.table;
        this.readConn = cfg.readConn;
        this.writeConn = cfg.writeConn;
        this.mapper = cfg.mapper;
        this.cacheService = cfg.cacheService;
    }

    async selectOne(
        config: SelectOptions,
    ): Promise<Result<Required<Domain>, RepoError | MapperError>> {
        const res = await this.select(config);
        if (!res.ok) return Err(res.val);
        const mapped = this.mapper.toDomain(res.val[0]);
        if (!mapped.ok) return Err(mapped.val);
        return Ok(mapped.val);
    }

    async selectMany(
        config: SelectOptions,
    ): Promise<Result<Required<Domain[]>, RepoError | MapperError>> {
        const res = await this.select(config);
        if (!res.ok) return Err(res.val);
        const mapped = this.mapper.toDomainList(res.val);
        if (!mapped.ok) return Err(mapped.val);
        return Ok(mapped.val);
    }

    async select(
        config: SelectOptions,
    ): Promise<Result<UnknownObject[], RepoError>> {
        if (config.cachingOptions) {
            const cacheRes = await this.cacheService.get(
                config.cachingOptions.key,
            );
            if (cacheRes.ok)
                return Ok<UnknownObject[]>(
                    JSON.parse(cacheRes.val) as UnknownObject[],
                );
        }

        let query;
        if (config.select) query = this.readConn.select(config.select);
        else query = this.readConn.select();
        query = query.from(this.table).where(config.where);

        let res;

        try {
            res = await query.execute();
        } catch (e: unknown) {
            return Err(
                new RepoError('Error selecting records.', e as RepoErrorBody),
            );
        }

        if (res.length === 0)
            return Err(
                new RepoError(
                    'No record was found.',
                    undefined,
                    RepoErrorCodes.ER_NO_RECORD,
                ),
            );

        if (config.cachingOptions)
            await this.cacheService.set(
                config.cachingOptions.key,
                JSON.stringify(res),
                config.cachingOptions.expires,
            );

        return Ok(res);
    }

    async insert(
        options: InsertOptions<Table>,
    ): Promise<Result<MySqlRawQueryResult, RepoError>> {
        try {
            if (options.transaction)
                return Ok(
                    await options.transaction
                        .insert(this.table)
                        .values(options.values),
                );
            return Ok(
                await this.writeConn.insert(this.table).values(options.values),
            );
        } catch (e: unknown) {
            return Err(
                new RepoError('Error inserting record.', e as RepoErrorBody),
            );
        }
    }

    async update(
        options: UpdateOptions<Domain>,
    ): Promise<Result<MySqlRawQueryResult, RepoError>> {
        try {
            if (options.transaction)
                return Ok(
                    await options.transaction
                        .update(this.table)
                        .set(options.values)
                        .where(options.where),
                );
            return Ok(
                await this.writeConn
                    .update(this.table)
                    .set(options.values)
                    .where(options.where),
            );
        } catch (e: unknown) {
            return Err(
                new RepoError('Error updating record.', e as RepoErrorBody),
            );
        }
    }
}
