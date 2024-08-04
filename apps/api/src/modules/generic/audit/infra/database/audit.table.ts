import {int, json, mysqlTable, text, varchar} from 'drizzle-orm/mysql-core';
import {baseColumns} from '../../../../shared/infra/database/baseColumns';

export const auditTable = mysqlTable('Audits', {
    ...baseColumns,

    table: varchar('table', {length: 191}).notNull(),
    column: varchar('column', {length: 191}).notNull(),

    data: json('data').notNull(),

    // Reference to the user id who made the change
    modifiedBy: int('modifiedBy').notNull(),
    comment: text('comment'),
});
