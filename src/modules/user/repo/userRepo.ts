import {eq} from 'drizzle-orm';
import {Repo} from '../../../core/repo';
import {db} from '../../../infra/database/mysql';
import {redisClient} from '../../../infra/database/redis';
import {User} from '../domain/user';
import {userTable} from '../infra/database/userTable';
import {userMapper} from "../mapper";

export class UserRepo extends Repo<User> {
    constructor() {
        super(userTable, db, userMapper, redisClient);
    }

    selectByEmail(email: string) {
        return this.selectOne(eq(userTable.email, email));
    }
}

