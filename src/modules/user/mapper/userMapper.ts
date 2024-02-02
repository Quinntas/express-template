import {User} from "../domain/user";

export function toDomain(raw: any): User {
    return {
        name: raw.name,
        email: raw.email,
        password: raw.password
    };
}

