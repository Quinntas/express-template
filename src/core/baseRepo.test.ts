import {BaseMapper} from './baseMapper';
import {BaseDomain} from "./baseDomain";
import {BaseRepo} from "./baseRepo";
import {expect, test, vi} from 'vitest';
import {MySqlTable} from "drizzle-orm/mysql-core";
import mysql from "mysql2/promise";
import {drizzle} from 'drizzle-orm/mysql2';
import {RedisClient} from "../utils/redisClient";

vi.mock('../infra/database/redis', () => {
    return {
        redisClient: {
            set: vi.fn(),
        },
    };
});

vi.mock('mysql2/promise', () => {
    const mysql = vi.importActual('mysql2/promise');
    return {
        default: {
            ...mysql,
            createPool: vi.fn().mockReturnValue({
                query: vi.fn(),
            }),
        }
    }
});

vi.mock('drizzle-orm/mysql2', () => ({
    drizzle: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    execute: vi.fn().mockReturnValue([{id: 1}]),
                }),
            }),
        }),
        insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
                execute: vi.fn().mockReturnValue({insertId: 1}),
            })
        }),
        update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    execute: vi.fn().mockReturnValue({affectedRows: 1}),
                }),
            }),
        }),
    }),
}));


interface MockDomain extends BaseDomain {
    id: number
}

class MockMapper extends BaseMapper<MockDomain> {
    toDomain(raw: any): Required<MockDomain> {
        if (!raw) throw new Error('Invalid input');
        if (raw.id === undefined) throw new Error('Invalid input');
        return raw as Required<MockDomain>;
    }

    toPublicDomain(data: MockDomain): Partial<MockDomain> {
        return data;
    }
}

const mockMapper = new MockMapper();

const mockDB = drizzle(
    mysql.createPool({
        uri: 'mock_uri',
    }),
);

const mockTable = new MySqlTable('mock_table', undefined, 'mock_table');

const mockRedisClient = new RedisClient('mock_uri');

class MockRepo extends BaseRepo<MockDomain> {
    constructor() {
        super(mockTable, mockDB, mockMapper, mockRedisClient);
    }
}

// @formatter:off
test('BaseRepo - Insert', async () => {
    const repo = new MockRepo();
    const mockDomain: MockDomain = {
        id: 1,
    }
    const res = await repo.insert(mockDomain);
    expect(mockDB.insert).toBeCalledWith(mockTable)
    expect(mockDB.insert(mockTable).values).toBeCalledWith(mockDomain)
    expect(mockDB.insert(mockTable).values(mockDomain).execute).toBeCalled()
    expect(res).toEqual({insertId: 1})
})
