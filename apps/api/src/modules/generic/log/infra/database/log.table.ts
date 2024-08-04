import {json, mysqlTable, text, varchar} from 'drizzle-orm/mysql-core';
import {baseColumns} from '../../../../shared/infra/database/baseColumns';

export const logTable = mysqlTable('Logs', {
    ...baseColumns,
    level: varchar('level', {length: 191}).notNull(),
    shape: varchar('shape', {length: 191}).notNull(),
    data: json('data').notNull(),
    stack: text('stack'),
});
