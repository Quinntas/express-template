import {User} from "../domain/user";
import {BaseMapper} from "../../../core/baseMapper";

export class UserMapper extends BaseMapper<User> {
    toPublicDomain(user: User): Partial<User> {
        return {
            pid: user.pid,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    toDomain(raw: any): User {
        return {
            id: raw.id,
            pid: raw.pid,
            name: raw.name,
            email: raw.email,
            password: raw.password,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };
    }
}

export const userMapper = new UserMapper();



