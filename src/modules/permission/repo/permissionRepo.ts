import {Permission} from "../domain/permission";
import {db} from "../../../infra/database/mysql";
import {permissionTable} from "../infra/database/permissionTable";
import {BaseRepo} from "../../../core/baseRepo";
import {permissionMapper} from "../mapper/permissionMapper";
import {sql} from "drizzle-orm";
import {resourceTable} from "../../resource/infra/database/resourceTable";

export class PermissionRepo extends BaseRepo<Permission> {
    constructor() {
        super(permissionTable, db, permissionMapper)
    }

    findByRoleIdAndPath(roleId: number, path: string) {
        return this.selectOne(
            // @formatter:off
            sql`${permissionTable.roleId} = ${roleId} AND ${permissionTable.resourceId} = (SELECT ${resourceTable.id} FROM ${resourceTable} WHERE path = ${path})`
        )
    }
}

export const permissionRepo = new PermissionRepo()
    