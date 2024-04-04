import {BaseDomain} from "../../../core/baseDomain";

export interface Permission extends BaseDomain {
    roleId: number;
    resourceId: number;
}
    