import {sql} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/mysql2';
import {MySqlTable} from 'drizzle-orm/mysql-core';
import mysql from 'mysql2/promise';
import {expect, test, vi} from 'vitest';
import {RedisClient} from '../utils/redisClient';
import {BaseDomain} from './baseDomain';
import {BaseMapper} from './baseMapper';
import {BaseRepo} from './baseRepo';

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
        },
    };
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
            }),
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
    id: number;
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
    };
    const res = await repo.insert(mockDomain);
    expect(mockDB.insert).toBeCalledWith(mockTable);
    expect(mockDB.insert(mockTable).values).toBeCalledWith(mockDomain);
    expect(mockDB.insert(mockTable).values(mockDomain).execute).toBeCalled();
    expect(res).toEqual({insertId: 1});
});

// @formatter:off
test('BaseRepo - Select', async () => {
    const repo = new MockRepo();
    const where = sql`id = 1`;
    const res = await repo.select(where);
    expect(mockDB.select).toBeCalled();
    expect(mockDB.select().from).toBeCalledWith(mockTable);
    expect(mockDB.select().from(mockTable).where).toBeCalledWith(where);
    expect(mockDB.select().from(mockTable).where(where).execute).toBeCalled();
    expect(res).toEqual([{id: 1}]);
});

// @formatter:off
test('BaseRepo - Update', async () => {
    const repo = new MockRepo();
    const values = {id: 1};
    const res = await repo.update(1, values);
    const where = sql`id = ${1}`;
    expect(mockDB.update).toBeCalledWith(mockTable);
    expect(mockDB.update(mockTable).set).toBeCalledWith(values);
    expect(mockDB.update(mockTable).set(values).where).toBeCalledWith(where);
    expect(mockDB.update(mockTable).set(values).where(where).execute).toBeCalled();
    expect(res).toEqual({affectedRows: 1});
});
