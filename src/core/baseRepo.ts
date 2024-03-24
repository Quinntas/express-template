import {BaseDomain} from "./baseDomain";
import {sql, SQL} from "drizzle-orm";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {MySql2Database} from "drizzle-orm/mysql2";
import {paginate, PaginateDTO} from "../utils/paginate";
import {db} from "../infra/database/mysql";
import {userTable} from "../modules/user/infra/database/userTable";
import {BaseMapper} from "./baseMapper";

export abstract class BaseRepo<Domain extends BaseDomain> {
    private readonly table: MySqlTable
    private readonly db: MySql2Database
    private readonly mapper: BaseMapper<Domain>

    protected constructor(table: MySqlTable, db: MySql2Database, mapper: BaseMapper<Domain>) {
        this.table = table
        this.db = db
        this.mapper = mapper
    }

    paginate<T extends BaseDomain = Domain>(where: SQL, paginateDTO: PaginateDTO) {
        return paginate<T>({
            db,
            table: userTable,
            limit: paginateDTO.limit,
            offset: paginateDTO.offset,
            where: where
        })
    }

    async selectOne(where: SQL): Promise<Required<Domain> | null> {
        const res = await this.select(where)
        if (!res || res.length == 0) return null
        return this.mapper.toDomain(res[0])
    }

    async selectMany(where: SQL): Promise<Domain[] | null> {
        const res = await this.select(where)
        if (!res || res.length == 0) return null
        return this.mapper.rawToDomainList(res)
    }

    select(where: SQL | undefined) {
        return this.db
            .select()
            .from(this.table)
            .where(where)
    }

    insert(values: Domain) {
        return this.db
            .insert(this.table)
            .values(values)
    }

    update(id: number, values: Partial<Domain>) {
        return this.db
            .update(this.table)
            .set(values)
            .where(sql`id
            =
            ${id}`)
    }
}