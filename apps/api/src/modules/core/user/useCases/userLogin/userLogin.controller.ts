import {Err, Ok} from 'ts-results';
import {HttpResponse} from '../../../../../lib/responses';
import {DecodedExpressRequest} from '../../../../../lib/types/decodedExpressRequest';
import {UserLoginDto, UserLoginResponseDTO} from './userLogin.dto';
import {userLoginUsecase} from './userLogin.usecase';

export async function userLoginController(req: DecodedExpressRequest<UserLoginDto>) {
    const res = await userLoginUsecase({
        data: req.decoded.body,
    });

    if (!res.ok) return Err(res.val);

    return Ok<HttpResponse<UserLoginResponseDTO>>({
        data: res.val,
    });
}
