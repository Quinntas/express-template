import {SQL, sql} from 'drizzle-orm';
import {MySql2Database} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import {BaseDomain} from '../core/baseDomain';
import {BaseMapper} from '../core/baseMapper';

/**
 * Represents a pagination data transfer object.
 */
export interface PaginateDTO {
    limit: number;
    offset: number;
}

/**
 * Represents the response for paginated data.
 *
 * @template D - The type of the data contained in the response.
 */
export type PaginateResponseDTO<D extends BaseDomain> = {
    count: number;
    hasMore: boolean;
    nextOffset: number;
    data: D[];
};

/**
 * Represents a PaginateInternalDTO object which is used for pagination with a specific MySqlTable and BaseDomain.
 * @interface
 * @extends PaginateDTO
 * @template T - Represents a MySqlTable type.
 * @template D - Represents a BaseDomain type.
 */
export interface PaginateInternalDTO<T extends MySqlTable, D extends BaseDomain> extends PaginateDTO {
    db: MySql2Database;
    table: T;
    where: SQL;
    mapper: BaseMapper<D>;
}

/**
 * Paginates data from a MySQL table based on the given parameters.
 *
 * @param {PaginateInternalDTO<T, D>} dto - The pagination parameters.
 * @returns {Promise<PaginateResponseDTO<D>>} - The paginated data.
 */
export async function paginate<T extends MySqlTable, D extends BaseDomain>(dto: PaginateInternalDTO<T, D>): Promise<PaginateResponseDTO<D>> {
    const q = sql<T>`
        SELECT *
        FROM ${dto.table}
        WHERE ${dto.where} LIMIT ${dto.limit + 1}
        OFFSET ${dto.offset}
    `;
    const res = await dto.db.execute(q);

    const hasMore = res.length > dto.limit;

    if (hasMore) res.pop();

    return {
        data: dto.mapper.rawToDomainList(res),
        count: res.length,
        hasMore: hasMore,
        nextOffset: hasMore ? dto.offset + dto.limit : dto.offset,
    };
}
