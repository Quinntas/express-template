import {User} from "../domain/user";
import {sql} from "../../../core/repo/parses/sql";
import {executeQuery} from "../../../core/repo/baseRepo";
import {spectreMain} from "../../../infra/database/spectreMain";
import {Conditionator} from "../../../core/conditionator";
import {toDomain} from "../mapper/userMapper";

export async function createUser(user: User) {
    const params = sql`INSERT INTO users (pid, email, password) VALUES (${user.pid}, ${user.email}, ${user.password})`;
    return await executeQuery({
        query: params[0],
        params: params[1],
        spectreInstance: spectreMain
    })
}

export async function getUser(pid: string, email: string) {
    const params = new Conditionator(`SELECT * FROM users`)
        .where()
        .add({key: 'pid', value: pid})
        .add({key: 'email', value: email, connector: 'AND'})
        .result(1, true);

    const result = await executeQuery({
        query: params[0],
        params: [],
        spectreInstance: spectreMain
    })

    if (!result.isSuccessful)
        return null

    return toDomain(result.returnValue[0])
}

