import {dbSchema} from "../../../shared/infra/database/schema";
import {datetime, int, varchar} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";

export const userTable = dbSchema.table("Users", {
    id: int("id").autoincrement().primaryKey(),
    pid: varchar("pid", {length: 191}).notNull(),
    createdAt: datetime("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),

    name: varchar("name", {length: 50}).notNull(),
    email: varchar("email", {length: 191}).notNull(),
    password: varchar("password", {length: 191}).notNull(),
})