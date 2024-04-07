import {BaseRepo} from '../../../core/baseRepo';
import {db} from '../../../infra/database/mysql';
import {redisClient} from '../../../infra/database/redis';
import {Role} from '../domain/role';
import {roleTable} from '../infra/database/roleTable';
import {roleMapper} from '../mapper/roleMapper';

export class RoleRepo extends BaseRepo<Role> {
    constructor() {
        super(roleTable, db, roleMapper, redisClient);
    }
}

export const roleRepo = new RoleRepo();
