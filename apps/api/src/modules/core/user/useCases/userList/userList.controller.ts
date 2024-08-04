import {Err, Ok} from 'ts-results';
import {DecodedExpressRequest} from '../../../../../lib/web/decodedExpressRequest';
import {HttpResponse} from '../../../../../lib/web/responses';
import {UserListQueryDto, UserListResponseDto} from './userList.dto';
import {userListUsecase} from './userList.usecase';

export async function userListController(
    req: DecodedExpressRequest<null, UserListQueryDto>,
) {
    const res = await userListUsecase({
        data: {
            pid: req.decoded.query.pid,
            limit: req.decoded.query.limit,
            offset: req.decoded.query.offset,
        },
    });

    if (!res.ok) return Err(res.val);

    return Ok<HttpResponse<UserListResponseDto>>({
        data: res.val,
    });
}
