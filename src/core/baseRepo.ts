import {BaseDomain} from "./baseDomain";
import {sql, SQL} from "drizzle-orm";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {MySql2Database} from "drizzle-orm/mysql2";
import {paginate, PaginateDTO} from "../utils/paginate";
import {db} from "../infra/database/mysql";
import {userTable} from "../modules/user/infra/database/userTable";

export interface IRepo {
}

export abstract class BaseRepo<Domain extends BaseDomain> implements IRepo {
    private readonly table: MySqlTable
    private readonly db: MySql2Database

    protected constructor(table: MySqlTable, db: MySql2Database) {
        this.table = table
        this.db = db
    }

    list<T extends BaseDomain = Domain>(where: SQL, paginateDTO: PaginateDTO) {
        return paginate<T>({
            db,
            table: userTable,
            limit: paginateDTO.limit + 1,
            offset: paginateDTO.offset,
            where: where
        })
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