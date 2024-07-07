import {Err, Ok} from 'ts-results';
import {MapperError} from '../../../core/errors';
import {Mapper} from '../../../core/mapper';
import {User} from '../domain/user';

export class UserMapper extends Mapper<User> {
    toPublicDomain(user: User) {
        try {
            return Ok({
                pid: user.pid,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch {
            return Err(new MapperError('could not convert domain to public domain'));
        }
    }

    toDomain(raw: any) {
        try {
            return Ok({
                pid: raw.pid,
                email: raw.email,
                password: raw.password,
                role: raw.role,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                id: raw.id,
            });
        } catch {
            return Err(new MapperError('could not convert raw to domain'));
        }
    }
}
