import {varchar} from 'drizzle-orm/mysql-core';
import {baseColumns} from '../../../shared/infra/database/baseColumns';
import {dbSchema} from '../../../shared/infra/database/schema';

export const resourceTable = dbSchema.table('Resources', {
    ...baseColumns,
    name: varchar('name', {length: 191}).notNull(),
    description: varchar('description', {length: 191}).notNull(),
    path: varchar('path', {length: 191}).notNull(),
});
 