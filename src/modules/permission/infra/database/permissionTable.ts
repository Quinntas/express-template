import {int} from 'drizzle-orm/mysql-core';
import {resourceTable} from '../../../resource/infra/database/resourceTable';
import {roleTable} from '../../../role/infra/database/roleTable';
import {baseColumns} from '../../../shared/infra/database/baseColumns';
import {dbSchema} from '../../../shared/infra/database/schema';

export const permissionTable = dbSchema.table('Permissions', {
    ...baseColumns,
    roleId: int('roleId')
        .notNull()
        .references(() => roleTable.id),
    resourceId: int('resourceId')
        .notNull()
        .references(() => resourceTable.id),
});
