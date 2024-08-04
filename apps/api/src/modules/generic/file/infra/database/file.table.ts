import {mysqlTable, varchar} from 'drizzle-orm/mysql-core';
import {baseColumns} from '../../../../shared/infra/database/baseColumns';

export const fileTable = mysqlTable('Files', {
    ...baseColumns,
    hash: varchar('hash', {length: 191}).notNull(),
    bucket: varchar('bucket', {length: 191}).notNull(),
    type: varchar('type', {length: 191}).notNull(),
});
