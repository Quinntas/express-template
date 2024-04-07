import {BaseDomain} from '../../../core/baseDomain';

export interface Resource extends BaseDomain {
    path: string;
    name: string;
    description: string;
}
