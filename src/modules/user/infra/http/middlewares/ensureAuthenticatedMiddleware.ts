import {NextFunction, Response} from 'express';
import {HttpError, InternalError} from '../../../../../core/errors';
import {redisClient} from '../../../../../infra/database/redis';
import {JWT} from '../../../../../utils/jsonWebToken';
import {loginRedisKeyPrefix} from '../../../useCases/userLogin/userLoginConstants';
import {PrivateLoginToken, PublicLoginToken} from '../../../useCases/userLogin/userLoginDTO';
import {UserDecodedExpressRequest} from '../userDecodedExpressRequest';

export async function ensureUserAuthenticatedMiddleware(req: UserDecodedExpressRequest<null, null>, _res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) throw new HttpError(401, 'No token provided');

    const tokenValue = token.split(' ');

    if (tokenValue.length !== 2 || tokenValue[0] !== 'Bearer') throw new HttpError(401, 'Invalid token format');

    const publicDecoded: PublicLoginToken = JWT.decode<PublicLoginToken>(tokenValue[1]);

    if (!publicDecoded) throw new HttpError(401, 'Invalid token');

    const privateToken = await redisClient.get(loginRedisKeyPrefix + publicDecoded.user.pid);

    if (!privateToken.ok) throw new InternalError('Could not retrieve token from redis');

    const privateDecoded: PrivateLoginToken = JWT.decode<PrivateLoginToken>(privateToken.val);

    req.user = privateDecoded.user;

    return next();
}
