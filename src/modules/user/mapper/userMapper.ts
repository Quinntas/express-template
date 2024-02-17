import {User} from "../domain/user";

export function toPublicDomain(user: User): Partial<User> {
    return {
        pid: user.pid,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

export function toDomain(raw: any): User {
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

