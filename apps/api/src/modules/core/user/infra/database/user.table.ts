import {mysqlTable, varchar} from 'drizzle-orm/mysql-core';
import {baseColumns} from '../../../../shared/infra/database/baseColumns';

export const userTable = mysqlTable('Users', {
    ...baseColumns,
    email: varchar('email', {length: 191}).notNull(),
    password: varchar('password', {length: 191}).notNull(),
    role: varchar('role', {length: 191}).notNull(),
});
