import {User} from "../domain/user";
import {sql} from "../../../core/repo/parses/sql";
import {executeQuery} from "../../../core/repo/baseRepo";
import {spectreMain} from "../../../infra/database/spectreMain";
import {toDomain} from "../mapper/userMapper";

export async function createUser(user: User) {
    const params = sql`INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.password})`;
    return await executeQuery({
        query: params[0],
        params: params[1],
        spectreInstance: spectreMain
    })
}

export async function getByName(name: string) {
    const params = sql`SELECT * FROM users WHERE name = ${name}`;
    const result = await executeQuery({
        query: params[0],
        params: params[1],
        spectreInstance: spectreMain
    })
    if (!result.isSuccessful)
        return null
    return toDomain(result.returnValue[0])
}