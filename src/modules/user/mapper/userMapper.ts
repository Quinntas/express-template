import {Mapper} from '../../../core/mapper';
import {User} from '../domain/user';

export class UserMapper extends Mapper<User> {
    toPublicDomain(user: User): Partial<User> {
        return {
            pid: user.pid,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    toDomain(raw: any): Required<User> {
        return {
            pid: raw.pid,
            email: raw.email,
            password: raw.password,
            role: raw.role,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            id: raw.id,
        };
    }
}

