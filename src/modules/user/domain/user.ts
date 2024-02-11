import {BaseDomain} from "../../../core/baseDomain";

export interface User extends BaseDomain {
    email: string;
    password: string;
}