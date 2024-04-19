import {SQL, sql} from 'drizzle-orm';
import {MySql2Database} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {PaginateDTO, paginate} from '../utils/paginate';
import {RedisClient} from '../utils/redisClient';
import {BaseDomain} from './baseDomain';
import {BaseMapper} from './baseMapper';

/**
 * Represents caching options for a specific operation.
 * @interface
 */
interface CachingOptions {
    expires: number;
    key: string;
}

/**
 * Base repository class for interacting with a database table.
 * @template Domain - The domain entity type.
 */
export abstract class BaseRepo<Domain extends BaseDomain> {
    private readonly table: MySqlTable;
    private readonly db: MySql2Database;
    private readonly mapper: BaseMapper<Domain>;
    private readonly redisClient: RedisClient;

    protected constructor(table: MySqlTable, db: MySql2Database, mapper: BaseMapper<Domain>, redisClient: RedisClient) {
        this.table = table;
        this.db = db;
        this.mapper = mapper;
        this.redisClient = redisClient;
    }

    /**
     * Paginates the data based on the provided SQL and paginateDTO.
     *
     * @param {string} where - The SQL query for filtering the data.
     * @param {PaginateDTO} paginateDTO - The pagination options including limit and offset.
     * @returns {Promise<Array<Domain>>} - A promise resolving to an array of domain objects.
     */
    paginate(where: SQL, paginateDTO: PaginateDTO) {
        return paginate<typeof this.table, Domain>({
            db: this.db,
            table: this.table,
            limit: paginateDTO.limit,
            offset: paginateDTO.offset,
            mapper: this.mapper,
            where,
        });
    }

    //@formatter:off
    /**
     * Handles caching for a given SQL query.
     *
     * @param {SQL} where - The SQL query to select data from the database.
     * @param {CachingOptions} options - The caching options.
     * @return {Promise<object[]>} - A promise that resolves to an array of objects.
     * @throws {Error} - If an error occurs while retrieving or setting data in the cache.
     */
    private async handleCaching(where: SQL, options: CachingOptions): Promise<{[p: string]: unknown}[]> {
        const cacheRes = await this.redisClient.get(options.key);
        if (!cacheRes) {
            const res = await this.select(where);
            await this.redisClient.set(options.key, JSON.stringify(res), options.expires);
            return res;
        }
        return JSON.parse(cacheRes) as {[p: string]: unknown}[];
    }

    /**
     * Retrieves a single record from the database based on the given conditions.
     *
     * @param {SQL} where - The conditions to filter the records.
     * @param {CachingOptions} [cachingOptions] - The options for caching the result.
     * @returns {Promise<Required<Domain> | null>} A promise that resolves to the retrieved record or null if not found.
     */
    async selectOne(where: SQL, cachingOptions?: CachingOptions): Promise<Required<Domain> | null> {
        const res = await this.select(where, cachingOptions);
        if (!res || res.length == 0) return null;
        return this.mapper.toDomain(res[0]);
    }

    /**
     * Asynchronously selects multiple entities based on the specified SQL condition.
     *
     * @param {SQL} where - The SQL condition to filter the entities.
     * @param {CachingOptions} [cachingOptions] - The options for caching the results.
     * @returns {Promise<Domain[] | null>} - A promise that resolves to an array of domains if the entities are found,
     *                                        or null if no entities match the condition.
     */
    async selectMany(where: SQL, cachingOptions?: CachingOptions): Promise<Domain[] | null> {
        const res = await this.select(where, cachingOptions);
        if (!res || res.length == 0) return null;
        return this.mapper.rawToDomainList(res);
    }

    /**
     * Executes a select query in the database with an optional caching option.
     *
     * @param {SQL} where - The SQL query for the WHERE clause.
     * @param {CachingOptions} [cachingOptions] - The caching options for the query.
     *
     * @returns {Promise<{[p: string]: unknown}[]>} - A promise that resolves to an array of objects representing the result set.
     */
    select(where: SQL, cachingOptions?: CachingOptions): Promise<{[p: string]: unknown}[]> {
        if (cachingOptions) return this.handleCaching(where, cachingOptions);
        return this.db.select().from(this.table).where(where).execute();
    }

    /**
     * Inserts a new record into the specified table with the provided values.
     *
     * @param {Domain} values - The values to be inserted into the table.
     * @return {Promise} - A promise that resolves when the insertion is successful.
     */
    insert(values: Domain) {
        return this.db.insert(this.table).values(values).execute();
    }

    //@formatter:off
    /**
     * Updates a record in the database with the specified id and values.
     *
     * @param {number} id - The id of the record to update.
     * @param {Partial<Domain>} values - The values to update the record with.
     * @return {Promise<void>} - A promise that resolves to `undefined` when the update is successful.
     */
    update(id: number, values: Partial<Domain>) {
        return this.db
            .update(this.table)
            .set(values)
            .where(sql`id = ${id}`)
            .execute();
    }
}
