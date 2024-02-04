import {User} from "../domain/user";

export function toPublicDomain(raw: any) {
    return {
        name: raw.name,
        email: raw.email
    };
}

export function toDomain(raw: any): User {
    return {
        name: raw.name,
        email: raw.email,
        password: raw.password
    };
}

