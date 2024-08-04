import {drizzle} from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {env} from '../../common/env';

export const rwMysqlConn = drizzle(
    mysql.createPool({
        uri: env.DATABASE_URL,
    }),
);
