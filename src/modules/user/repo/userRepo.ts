import {User} from "../domain/user";
import {db} from "../../../infra/database/mysql";
import {userTable} from "../infra/database/userTable";
import {eq} from "drizzle-orm";
import {BaseRepo} from "../../../core/baseRepo";
import {userMapper} from "../mapper/userMapper";

export class UserRepo extends BaseRepo<User> {
    constructor() {
        super(userTable, db)
    }

    async selectByEmail(email: string) {
        const res = await this.select(eq(userTable.email, email))
        if (!res || res.length == 0) return null
        return userMapper.toDomain(res[0])
    }
}

export const userRepo = new UserRepo()


