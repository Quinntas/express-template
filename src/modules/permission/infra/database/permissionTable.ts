import {dbSchema} from "../../../shared/infra/database/schema";
import {baseColumns} from "../../../shared/infra/database/baseColumns";
import {int} from "drizzle-orm/mysql-core";
import {roleTable} from "../../../role/infra/database/roleTable";
import {resourceTable} from "../../../resource/infra/database/resourceTable";

export const permissionTable = dbSchema.table("Permissions", {
    ...baseColumns,
    roleId: int('roleId').notNull().references(() => roleTable.id),
    resourceId: int('resourceId').notNull().references(() => resourceTable.id),
})