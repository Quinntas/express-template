import {sql} from 'drizzle-orm';
import {BaseRepo} from '../../../core/baseRepo';
import {db} from '../../../infra/database/mysql';
import {resourceTable} from '../../resource/infra/database/resourceTable';
import {Permission} from '../domain/permission';
import {permissionTable} from '../infra/database/permissionTable';
import {permissionMapper} from '../mapper/permissionMapper';
import {redisClient} from "../../../infra/database/redis";

export class PermissionRepo extends BaseRepo<Permission> {
    constructor() {
        super(permissionTable, db, permissionMapper, redisClient);
    }

    findByRoleIdAndPath(roleId: number, path: string) {
        return this.selectOne(
            // @formatter:off
            sql`${permissionTable.roleId} = ${roleId} AND ${permissionTable.resourceId} = (SELECT ${resourceTable.id} FROM ${resourceTable} WHERE path = ${path})`,
            {
                key: `findByRoleIdAndPath:${roleId}:${path}`,
                expires: 60 * 60 // 1 hour
            }
        );
    }
}

export const permissionRepo = new PermissionRepo();
