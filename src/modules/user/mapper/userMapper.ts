import {User} from "../domain/user";

export function toPublicDomain(raw: User) {
    return {
        pid: raw.pid,
        email: raw.email
    };
}

export function toDomain(raw: any): User {
    return {
        id: raw.id,
        pid: raw.pid,
        email: raw.email,
        password: raw.password,
        updated_at: raw.updated_at,
        created_at: raw.created_at
    };
}

