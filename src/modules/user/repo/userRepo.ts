import {User} from "../domain/user";
import {sql} from "../../../core/repo/parses/sql";
import {executeQuery} from "../../../core/repo/baseRepo";

export async function createUser(user: User) {
    const params = sql`INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.password})`;
    return await executeQuery({
        query: params[0],
        params: params[1],
        spectreInstance: null
    })
}