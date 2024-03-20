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

    toDomain(raw: any): Required<User> {
        if (!raw) throw new Error("Invalid input");
        if (raw.id === undefined) throw new Error("Invalid input")
        if (raw.pid === undefined) throw new Error("Invalid input")
        if (raw.name === undefined) throw new Error("Invalid input")
        if (raw.email === undefined) throw new Error("Invalid input")
        if (raw.password === undefined) throw new Error("Invalid input")
        if (raw.createdAt === undefined) throw new Error("Invalid input")
        if (raw.updatedAt === undefined) throw new Error("Invalid input")
        return raw as Required<User>;
    }
}

export const userMapper = new UserMapper();



