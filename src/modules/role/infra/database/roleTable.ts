import {dbSchema} from "../../../shared/infra/database/schema";
import {baseColumns} from "../../../shared/infra/database/baseColumns";
import {varchar} from "drizzle-orm/mysql-core/index";

export const roleTable = dbSchema.table("Roles", {
    ...baseColumns,
    name: varchar('name', {length: 191}).notNull(),
    description: varchar('description', {length: 191}).notNull(),
})