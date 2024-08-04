import {Domain} from '../../../../lib/ddd/domain';
import {userTable} from '../infra/database/user.table';

export enum UserRolesEnum {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
}

export interface User extends Domain<typeof userTable> {
    role: UserRolesEnum;
}
