import {varchar} from 'drizzle-orm/mysql-core/index';
import {baseColumns} from '../../../shared/infra/database/baseColumns';
import {dbSchema} from '../../../shared/infra/database/schema';

export const roleTable = dbSchema.table('Roles', {
    ...baseColumns,
    name: varchar('name', {length: 191}).notNull(),
    description: varchar('description', {length: 191}).notNull(),
});
