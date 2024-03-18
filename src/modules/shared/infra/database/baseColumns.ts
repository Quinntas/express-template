import {datetime, int, varchar} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";

export const baseColumns = {
    id: int("id").autoincrement().primaryKey(),
    pid: varchar("pid", {length: 191}).notNull(),
    createdAt: datetime("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
}