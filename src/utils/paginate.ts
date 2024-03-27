import {sql, SQL} from 'drizzle-orm';
import {MySql2Database} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {BaseDomain} from '../core/baseDomain';
import {db} from "../infra/database/mysql";
import {BaseMapper} from "../core/baseMapper";

export interface PaginateDTO {
    limit: number;
    offset: number;
}

export type PaginateResponseDTO<D extends BaseDomain> = {
    count: number;
    hasMore: boolean;
    nextOffset: number;
    data: D[];
}

export interface PaginateInternalDTO<T extends MySqlTable, D extends BaseDomain> extends PaginateDTO {
    db: MySql2Database;
    table: T;
    where: SQL;
    mapper: BaseMapper<D>
}

export async function paginate<T extends MySqlTable, D extends BaseDomain>(dto: PaginateInternalDTO<T, D>): Promise<PaginateResponseDTO<D>> {
    const q = sql<T>`
        SELECT *
        FROM ${dto.table}
        WHERE ${dto.where} LIMIT ${dto.limit + 1}
        OFFSET ${dto.offset}
    `
    const res = await db.execute(q);

    const hasMore = res.length > dto.limit;

    if (hasMore) res.pop();

    return {
        data: dto.mapper.rawToDomainList(res),
        count: res.length,
        hasMore: hasMore,
        nextOffset: hasMore ? dto.offset + dto.limit : dto.offset,
    };
}
