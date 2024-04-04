import {Role} from "../domain/role";
import {db} from "../../../infra/database/mysql";
import {roleTable} from "../infra/database/roleTable";
import {BaseRepo} from "../../../core/baseRepo";
import {roleMapper} from "../mapper/roleMapper";

export class RoleRepo extends BaseRepo<Role> {
    constructor() {
        super(roleTable, db, roleMapper)
    }
}

export const roleRepo = new RoleRepo()
    