import {SQL, sql} from 'drizzle-orm';
import {MySql2Database} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {db} from '../infra/database/mysql';
import {paginate, PaginateDTO, PaginateInternalDTO} from '../utils/paginate';
import {BaseDomain} from './baseDomain';
import {BaseMapper} from './baseMapper';

export abstract class BaseRepo<Domain extends BaseDomain> {
    private readonly table: MySqlTable;
    private readonly db: MySql2Database;
    private readonly mapper: BaseMapper<Domain>;

    protected constructor(table: MySqlTable, db: MySql2Database, mapper: BaseMapper<Domain>) {
        this.table = table;
        this.db = db;
        this.mapper = mapper;
    }

    paginate(where: SQL, paginateDTO: PaginateDTO, select?: PaginateInternalDTO<typeof this.table, Domain>['select']) {
        return paginate<typeof this.table, Domain>({
            db,
            table: this.table,
            limit: paginateDTO.limit,
            offset: paginateDTO.offset,
            mapper: this.mapper,
            select,
            where,
        });
    }

    async selectOne(where: SQL): Promise<Required<Domain> | null> {
        const res = await this.select(where);
        if (!res || res.length == 0) return null;
        return this.mapper.toDomain(res[0]);
    }

    async selectMany(where: SQL): Promise<Domain[] | null> {
        const res = await this.select(where);
        if (!res || res.length == 0) return null;
        return this.mapper.rawToDomainList(res);
    }

    select(where: SQL | undefined) {
        return this.db.select().from(this.table).where(where);
    }

    insert(values: Domain) {
        return this.db.insert(this.table).values(values);
    }

    update(id: number, values: Partial<Domain>) {
        return this.db.update(this.table).set(values).where(sql`id
        =
        ${id}`);
    }
}
