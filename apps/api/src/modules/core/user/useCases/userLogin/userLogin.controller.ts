import {Err, Ok} from 'ts-results';
import {cacheService} from '../../../../../infra/connections/cache';
import {DecodedExpressRequest} from '../../../../../lib/web/decodedExpressRequest';
import {HttpResponse} from '../../../../../lib/web/responses';
import {UserLoginDto, UserLoginResponseDTO} from './userLogin.dto';
import {userLoginUsecase} from './userLogin.usecase';

export async function userLoginController(req: DecodedExpressRequest<UserLoginDto>) {
    const res = await userLoginUsecase(
        {
            data: req.decoded.body,
        },
        cacheService,
    );

    if (!res.ok) return Err(res.val);

    return Ok<HttpResponse<UserLoginResponseDTO>>({
        data: res.val,
    });
}
