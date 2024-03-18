import {dbSchema} from "../../../shared/infra/database/schema";
import {varchar} from "drizzle-orm/mysql-core";
import {baseColumns} from "../../../shared/infra/database/baseColumns";

export const userTable = dbSchema.table("Users", {
    ...baseColumns,
    name: varchar("name", {length: 50}).notNull(),
    email: varchar("email", {length: 191}).notNull(),
    password: varchar("password", {length: 191}).notNull(),
})