import {sql} from 'drizzle-orm';
import {datetime, int, varchar} from 'drizzle-orm/mysql-core';

export const baseColumns = {
    id: int('id').autoincrement().primaryKey(),
    pid: varchar('pid', {length: 191}).notNull(),
    createdAt: datetime('createdAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updatedAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
};
