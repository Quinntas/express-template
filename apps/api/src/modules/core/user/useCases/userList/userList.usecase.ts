import {SQL, eq, sql} from 'drizzle-orm';
import {Err, Ok, Result} from 'ts-results';
import {DTO} from '../../../../../lib/ddd/dto';
import {MapperError, RepoError} from '../../../../../lib/web/errors';
import {userTable} from '../../infra/database/user.table';
import {userMapper} from '../../mapper';
import {userRepo} from '../../repo';
import {
    userListCacheExpiration,
    userListCacheKeyPrefix,
} from './userList.constants';
import {UserListDto, UserListResponseDto} from './userList.dto';

export async function userListUsecase(
    dto: DTO<UserListDto>,
): Promise<Result<UserListResponseDto, RepoError | MapperError>> {
    const where: SQL = sql``;

    if (dto.data.pid) where.append(eq(userTable.pid, dto.data.pid));

    const result = await userRepo.select({
        where,
        cachingOptions: {
            key: `${userListCacheKeyPrefix}${where}`,
            expires: userListCacheExpiration,
        },
    });

    if (result.err) return Err(result.val);

    const mapperResult = userMapper.toDomainList(result.val);

    if (mapperResult.err) return Err(mapperResult.val);

    return Ok<UserListResponseDto>({
        data: mapperResult.val,
        meta: {
            pagination: undefined,
            total: 0,
        },
    });
}
