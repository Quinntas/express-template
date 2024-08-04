import {PaginationQuery} from '../../../../../utils/types';
import {User} from '../../domain/user';

export interface UserListQueryDto extends PaginationQuery {
    pid: string;
}

export interface UserListDto extends UserListQueryDto {}

export interface UserListResponseDto {
    data: Partial<User>[];
    meta: {
        pagination?: {
            nextOffset: number;
            totalPages: number;
            hasNext: boolean;
        };
        total: number;
    };
}
