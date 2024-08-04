import {eq} from 'drizzle-orm';
import {Repo, RepoConfig} from '../../../../lib/repo';
import {User} from '../domain/user';
import {userTable} from '../infra/database/user.table';

export class UserRepo extends Repo<User, typeof userTable> {
    constructor(cfg: RepoConfig<User>) {
        super(cfg);
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
