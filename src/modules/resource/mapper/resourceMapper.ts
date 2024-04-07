import {BaseMapper} from '../../../core/baseMapper';
import {InternalError} from '../../../core/errors';
import {Resource} from '../domain/resource';

export class ResourceMapper extends BaseMapper<Resource> {
    toPublicDomain(resource: Resource): Partial<Resource> {
        return {
            id: resource.id,
            pid: resource.pid,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        };
    }

    toDomain(raw: any): Required<Resource> {
        if (!raw) throw new InternalError('Invalid input');
        if (raw.id === undefined) throw new InternalError('Invalid input');
        if (raw.pid === undefined) throw new InternalError('Invalid input');
        if (raw.createdAt === undefined) throw new InternalError('Invalid input');
        if (raw.updatedAt === undefined) throw new InternalError('Invalid input');
        return raw as Required<Resource>;
    }
}

export const resourceMapper = new ResourceMapper();
