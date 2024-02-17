import {BaseDomain} from "../../../core/baseDomain";

export interface User extends BaseDomain {
    name: string;
    email: string;
    password: string;
}