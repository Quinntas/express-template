import {SQL, sql} from 'drizzle-orm';
import {MySql2Database} from 'drizzle-orm/mysql2';
import {MySqlDialect, MySqlTable} from 'drizzle-orm/mysql-core';
import {db} from '../infra/database/mysql';
import {paginate, PaginateDTO} from '../utils/paginate';
import {RedisClient} from '../utils/redisClient';
import {BaseDomain} from './baseDomain';
import {BaseMapper} from './baseMapper';

interface CachingOptions {
    expires: number;
    key: string | null;
}

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

    paginate(where: SQL, paginateDTO: PaginateDTO) {
        return paginate<typeof this.table, Domain>({
            db,
            table: this.table,
            limit: paginateDTO.limit,
            offset: paginateDTO.offset,
            mapper: this.mapper,
            where,
        });
    }

    //@formatter:off
    private async handleCaching(options: CachingOptions, where: SQL): Promise<{[p: string]: unknown}[]> {
        let key = options.key;
        if (!key) {
            const dialect = new MySqlDialect()
            const whereQueryString = dialect.sqlToQuery(where).sql // TODO: make this the hash of the hole query | now it may cause conflicts
            key = Buffer.from(whereQueryString).toString('base64');
        }
        const cacheRes = await this.redisClient.get(key);
        if (!cacheRes) {
            const res = await this.select(where)
            await this.redisClient.set(key, JSON.stringify(res), options.expires);
            return res;
        }
        return JSON.parse(cacheRes) as {[p: string]: unknown}[];
    }

    async selectOne(where: SQL, cachingOptions?: CachingOptions): Promise<Required<Domain> | null> {
        const res = await this.select(where, cachingOptions);
        if (!res || res.length == 0) return null;
        return this.mapper.toDomain(res[0]);
    }

    async selectMany(where: SQL, cachingOptions?: CachingOptions): Promise<Domain[] | null> {
        const res = await this.select(where, cachingOptions);
        if (!res || res.length == 0) return null;
        return this.mapper.rawToDomainList(res);
    }

    select(where: SQL, cachingOptions?: CachingOptions): Promise<{[p: string]: unknown}[]> {
        const q = this.db
            .select()
            .from(this.table)
            .where(where)
            .execute();
        if (cachingOptions) return this.handleCaching(cachingOptions, where);
        return q;
    }

    insert(values: Domain) {
        return this.db
            .insert(this.table)
            .values(values)
            .execute();
    }

    //@formatter:off
    update(id: number, values: Partial<Domain>) {
        return this.db
            .update(this.table)
            .set(values)
            .where(sql`id = ${id}`)
            .execute();
    }
}
