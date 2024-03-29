import {eq} from 'drizzle-orm';
import {BaseRepo} from '../../../core/baseRepo';
import {db} from '../../../infra/database/mysql';
import {User} from '../domain/user';
import {userTable} from '../infra/database/userTable';
import {userMapper} from '../mapper/userMapper';

export class UserRepo extends BaseRepo<User> {
    constructor() {
        super(userTable, db, userMapper);
    }

    selectByEmail(email: string) {
        return this.selectOne(eq(userTable.email, email));
    }
}

export const userRepo = new UserRepo();
