import {NextFunction, Response} from 'express';
import {Err, Ok} from 'ts-results';
import {redisClient} from '../../../../../../../infra/connections/redis';
import {HttpError, InternalError} from '../../../../../../../lib/errors';
import {JWT} from '../../../../../../../utils/jsonWebToken';
import {loginRedisKeyPrefix} from '../../../../useCases/userLogin/userLogin.constants';
import {PrivateLoginToken, PublicLoginToken} from '../../../../useCases/userLogin/userLogin.dto';
import {UserDecodedExpressRequest} from '../../user.decodedExpressRequest';

export async function ensureUserAuthenticatedMiddleware(req: UserDecodedExpressRequest<null, null>, _res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) return Err(new HttpError(401, 'No token provided'));

    const tokenValue = token.split(' ');

    if (tokenValue.length !== 2 || tokenValue[0] !== 'Bearer') return Err(new HttpError(401, 'Invalid token format'));

    const publicDecoded: PublicLoginToken = JWT.decode<PublicLoginToken>(tokenValue[1]);

    if (!publicDecoded) return Err(new HttpError(401, 'Invalid token'));

    const privateToken = await redisClient.get(loginRedisKeyPrefix + publicDecoded.user.pid);

    if (!privateToken.ok) return Err(new InternalError('Could not retrieve token from redis'));

    const privateDecoded: PrivateLoginToken = JWT.decode<PrivateLoginToken>(privateToken.val);

    req.user = privateDecoded.user;

    return Ok(next());
}
