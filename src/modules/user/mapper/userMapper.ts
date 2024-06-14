import {InternalError} from '../../../core/errors';
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
        if (!raw) throw new InternalError('Invalid input');
        if (raw.id === undefined) throw new InternalError('Missing id');
        if (raw.pid === undefined) throw new InternalError('Missing pid');
        if (raw.email === undefined) throw new InternalError('Missing email');
        if (raw.password === undefined) throw new InternalError('Missing password');
        if (raw.createdAt === undefined) throw new InternalError('Missing createdAt');
        if (raw.updatedAt === undefined) throw new InternalError('Missing updatedAt');
        return raw as Required<User>;
    }
}

export const userMapper = new UserMapper();
