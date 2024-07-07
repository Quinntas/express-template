import {eq} from 'drizzle-orm';
import {Repo} from '../../../core/repo';
import {rwMysqlConn} from '../../../infra/database/mysql';
import {redisClient} from '../../../infra/database/redis';
import {User} from '../domain/user';
import {userTable} from '../infra/database/userTable';
import {userMapper} from '../mapper';

export class UserRepo extends Repo<User> {
    constructor() {
        super(userTable, rwMysqlConn, rwMysqlConn, userMapper, redisClient);
    }

    selectByEmail(email: string) {
        return this.selectOne({
            where: eq(userTable.email, email),
            cachingOptions: {
                key: `userRepo:selectByEmail:${email}`,
                expires: 60, // 1 minute
            },
        });
    }
}
