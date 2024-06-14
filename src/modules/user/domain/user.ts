import {Domain} from '../../../core/types/domain';
import {userTable} from '../infra/database/userTable';

export enum UserRolesEnum {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
}

export interface User extends Domain<typeof userTable> {
    role: UserRolesEnum;
}
