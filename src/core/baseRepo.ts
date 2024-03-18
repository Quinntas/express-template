import {BaseDomain} from "./baseDomain";
import {sql, SQL} from "drizzle-orm";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {MySql2Database} from "drizzle-orm/mysql2";
import {paginate, PaginateDTO, PaginateResponseDTO} from "../utils/paginate";
import {db} from "../infra/database/mysql";
import {userTable} from "../modules/user/infra/database/userTable";


export interface IRepo<Domain extends BaseDomain> {
    update: (id: number, values: Partial<Domain>) => Promise<boolean>

    select: (where: SQL) => Promise<Domain[] | Domain | null>

    insert: (values: Domain) => Promise<boolean>

    list: (where: SQL, paginateDTO: PaginateDTO) => Promise<PaginateResponseDTO<Domain>>
}

export abstract class BaseRepo<Domain extends BaseDomain> implements IRepo<Domain> {
    private readonly table: MySqlTable
    private readonly db: MySql2Database

    protected constructor(table: MySqlTable, db: MySql2Database) {
        this.table = table
        this.db = db
    }

    async list<T extends BaseDomain = Domain>(where: SQL, paginateDTO: PaginateDTO) {
        return await paginate<T>({
            db,
            table: userTable,
            limit: paginateDTO.limit + 1,
            offset: paginateDTO.offset,
            where: where
        })
    }

    async select<T extends BaseDomain = Domain>(where: SQL | undefined): Promise<T[] | null> {
        const res = await this.db
            .select()
            .from(this.table)
            .where(where) as T[]
        switch (res.length) {
            case 0:
                return null
            default:
                return res
        }
    }

    async insert(values: Domain): Promise<boolean> {
        const res = await this.db
            .insert(this.table)
            .values(values)
        return res.length > 0
    }

    async update(id: number, values: Partial<Domain>): Promise<boolean> {
        const res = await this.db
            .update(this.table)
            .set(values)
            .where(sql`id
            =
            ${id}`)
        return res.length > 0
    }
}