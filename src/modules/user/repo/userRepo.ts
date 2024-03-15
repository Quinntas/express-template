import {User} from "../domain/user";
import {db,} from "../../../infra/database/mysql";
import {toDomain} from "../mapper/userMapper";
import {userTable} from "../infra/database/userTable";
import {and, eq} from "drizzle-orm";

export async function createUser(user: User) {
    return db
        .insert(userTable)
        .values({
            pid: user.pid!,
            name: user.name,
            email: user.email,
            password: user.password
        });
}

export async function getUser(name?: string, email?: string) {

    const res = await db
        .select()
        .from(userTable)
        .where(and(
            email === undefined ? undefined : eq(userTable.email, email),
            name === undefined ? undefined : eq(userTable.name, name)
        ))

    if (res.length === 0)
        return null

    return toDomain(res[0])
}