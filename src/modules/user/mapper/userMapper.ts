import {BaseMapper} from '../../../core/baseMapper';
import {InternalError} from '../../../core/errors';
import {User} from '../domain/user';

export class UserMapper extends BaseMapper<User> {
    toPublicDomain(user: User): Partial<User> {
        return {
            pid: user.pid,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    toDomain(raw: any): Required<User> {
        if (!raw) throw new InternalError('Invalid input');
        if (raw.id === undefined) throw new InternalError('Invalid input');
        if (raw.pid === undefined) throw new InternalError('Invalid input');
        if (raw.name === undefined) throw new InternalError('Invalid input');
        if (raw.email === undefined) throw new InternalError('Invalid input');
        if (raw.password === undefined) throw new InternalError('Invalid input');
        if (raw.createdAt === undefined) throw new InternalError('Invalid input');
        if (raw.updatedAt === undefined) throw new InternalError('Invalid input');
        return raw as Required<User>;
    }
}

export const userMapper = new UserMapper();
