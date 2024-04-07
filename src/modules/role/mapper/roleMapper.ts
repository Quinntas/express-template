import {BaseMapper} from '../../../core/baseMapper';
import {InternalError} from '../../../core/errors';
import {Role} from '../domain/role';

export class RoleMapper extends BaseMapper<Role> {
    toPublicDomain(role: Role): Partial<Role> {
        return {
            id: role.id,
            pid: role.pid,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }

    toDomain(raw: any): Required<Role> {
        if (!raw) throw new InternalError('Invalid input');
        if (raw.id === undefined) throw new InternalError('Invalid input');
        if (raw.pid === undefined) throw new InternalError('Invalid input');
        if (raw.createdAt === undefined) throw new InternalError('Invalid input');
        if (raw.updatedAt === undefined) throw new InternalError('Invalid input');
        return raw as Required<Role>;
    }
}

export const roleMapper = new RoleMapper();
