import {User} from "../domain/user";
import {sql} from "../../../core/repo/parsers/sql/sql";
import {executeQuery} from "../../../core/repo/baseRepo";
import {spectreMain} from "../../../infra/database/spectreMain";
import {toDomain} from "../mapper/userMapper";
import {Conditionator} from "../../../core/conditionator";
import {redisClient} from "../../../infra/database/redis";

export async function createUser(user: User) {
    const params = sql`INSERT INTO users (pid, name, email, password)
                       VALUES (${user.pid}, ${user.name}, ${user.email}, ${user.password})`;
    return await executeQuery({
        query: params[0],
        params: params[1],
        spectreInstance: spectreMain
    })
}

export async function getUser(name?: string, email?: string) {
    const conditionedQuery = new Conditionator("SELECT * FROM users")
        .where()
        .add({key: 'name', value: name})
        .add({key: 'email', value: email, connector: 'AND'})
        .result();
    if (typeof conditionedQuery === 'string')
        return null
    const result = await executeQuery({
        query: conditionedQuery[0],
        params: conditionedQuery[1],
        spectreInstance: spectreMain,
        cache: {
            key: `getUser-${conditionedQuery[1].join('-')}`,
            redisInstance: redisClient
        }
    })
    if (!result.isSuccessful)
        return null
    return toDomain(result.returnValue[0])
}