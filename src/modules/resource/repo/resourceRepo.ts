import {BaseRepo} from '../../../core/baseRepo';
import {db} from '../../../infra/database/mysql';
import {Resource} from '../domain/resource';
import {resourceTable} from '../infra/database/resourceTable';
import {resourceMapper} from '../mapper/resourceMapper';
import {redisClient} from "../../../infra/database/redis";

export class ResourceRepo extends BaseRepo<Resource> {
    constructor() {
        super(resourceTable, db, resourceMapper, redisClient);
    }
}

export const resourceRepo = new ResourceRepo();
