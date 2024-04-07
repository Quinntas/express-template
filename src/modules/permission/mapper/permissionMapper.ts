import {BaseMapper} from '../../../core/baseMapper';
import {InternalError} from '../../../core/errors';
import {Permission} from '../domain/permission';

export class PermissionMapper extends BaseMapper<Permission> {
    toPublicDomain(permission: Permission): Partial<Permission> {
        return {
            id: permission.id,
            pid: permission.pid,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
        };
    }

    toDomain(raw: any): Required<Permission> {
        if (!raw) throw new InternalError('Invalid input');
        if (raw.id === undefined) throw new InternalError('Invalid input');
        if (raw.pid === undefined) throw new InternalError('Invalid input');
        if (raw.createdAt === undefined) throw new InternalError('Invalid input');
        if (raw.updatedAt === undefined) throw new InternalError('Invalid input');
        return raw as Required<Permission>;
    }
}

export const permissionMapper = new PermissionMapper();
