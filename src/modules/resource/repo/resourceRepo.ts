import {BaseRepo} from '../../../core/baseRepo';
import {db} from '../../../infra/database/mysql';
import {redisClient} from '../../../infra/database/redis';
import {Resource} from '../domain/resource';
import {resourceTable} from '../infra/database/resourceTable';
import {resourceMapper} from '../mapper/resourceMapper';

export class ResourceRepo extends BaseRepo<Resource> {
    constructor() {
        super(resourceTable, db, resourceMapper, redisClient);
    }
}

export const resourceRepo = new ResourceRepo();
