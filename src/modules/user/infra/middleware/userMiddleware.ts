import {NextFunction, Response} from 'express';
import {HttpError} from '../../../../core/errors';
import {redisClient} from '../../../../infra/database/redis';
import {jwtDecode} from '../../../../utils/jsonWebToken';
import {loginRedisKeyPrefix} from '../../useCases/login/loginConstants';
import {PrivateLoginToken, PublicLoginToken} from '../../useCases/login/loginDTO';
import {UserDecodedExpressRequest} from '../http/userDecodedExpressRequest';
import {hasPermissionUseCase} from "../../../permission/useCases/hasPermission/hasPermissionUseCase";

export async function ensureUserAuthenticated(req: UserDecodedExpressRequest<null, null>, _res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) throw new HttpError(401, 'No token provided');

    const tokenValue = token.split(' ');

    if (tokenValue.length !== 2 || tokenValue[0] !== 'Bearer') throw new HttpError(401, 'Invalid token format');

    const publicDecoded: PublicLoginToken = jwtDecode<PublicLoginToken>(tokenValue[1]);

    if (!publicDecoded) throw new HttpError(401, 'Invalid token');

    const privateToken = await redisClient.get(loginRedisKeyPrefix + publicDecoded.userPid);

    if (!privateToken) throw new HttpError(401, 'Token not found');

    const privateDecoded: PrivateLoginToken = jwtDecode<PrivateLoginToken>(privateToken);

    const hasPermission = await hasPermissionUseCase({
        roleId: privateDecoded.roleId,
        path: req.path,
    })

    if (!hasPermission) throw new HttpError(403, 'Forbidden');

    req.user = {
        pid: privateDecoded.userPid,
        id: privateDecoded.userId,
        email: privateDecoded.userEmail,
    };

    next();
}
