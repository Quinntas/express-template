import {MySql2Database} from "drizzle-orm/mysql2";
import {SQL} from "drizzle-orm";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {BaseDomain} from "../core/baseDomain";

export interface PaginateDTO {
    limit: number;
    offset: number;
}

export interface PaginateResponseDTO<T extends BaseDomain> {
    data: T[];
    count: number;
    hasMore: boolean;
    nextOffset: number;
}

export interface PaginateInternalDTO extends PaginateDTO {
    db: MySql2Database;
    table: MySqlTable
    where: SQL
}

export async function paginate<T extends BaseDomain>(dto: PaginateInternalDTO): Promise<PaginateResponseDTO<T>> {
    const res: T[] = await dto.db
        .select()
        .from(dto.table)
        .where(dto.where)
        .limit(dto.limit + 1)
        .offset(dto.offset) as T[]

    const hasMore = res.length > dto.limit

    if (hasMore)
        res.pop()

    return {
        data: res,
        count: res.length,
        hasMore: hasMore,
        nextOffset: hasMore ? dto.offset + dto.limit : dto.offset
    }
}