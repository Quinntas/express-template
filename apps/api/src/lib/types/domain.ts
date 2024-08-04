import {InferSelectModel} from 'drizzle-orm';
import {MySqlTable} from 'drizzle-orm/mysql-core';

export type Domain<T extends MySqlTable> = InferSelectModel<T>;
