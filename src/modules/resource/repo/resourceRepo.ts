import {Resource} from "../domain/resource";
import {db} from "../../../infra/database/mysql";
import {resourceTable} from "../infra/database/resourceTable";
import {BaseRepo} from "../../../core/baseRepo";
import {resourceMapper} from "../mapper/resourceMapper";

export class ResourceRepo extends BaseRepo<Resource> {
    constructor() {
        super(resourceTable, db, resourceMapper)
    }
}

export const resourceRepo = new ResourceRepo()
    