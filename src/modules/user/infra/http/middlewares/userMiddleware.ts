import {NextFunction, Response} from 'express';
import {HttpError} from '../../../../../core/errors';
import {redisClient} from '../../../../../infra/database/redis';
import {jwtDecode} from '../../../../../utils/jsonWebToken';
import {permissionCheckUseCase} from '../../../../permission/useCases/permissionCheck/permissionCheckUseCase';
import {loginRedisKeyPrefix} from '../../../useCases/userLogin/userLoginConstants';
import {PrivateLoginToken, PublicLoginToken} from '../../../useCases/userLogin/userLoginDTO';
import {UserDecodedExpressRequest} from '../userDecodedExpressRequest';

/**
 * Formats the given original URL into a clean path URL.
 *
 * @param {string} originalUrl - The original URL to format.
 *
 * @return {string} The formatted path URL.
 */
function formatPath(originalUrl: string): string {
    const splitUrl = originalUrl.split('/');
    const baseUrl = splitUrl[2] + '/';
    const url = baseUrl + splitUrl.slice(3).join('/');
    return url.split('?')[0];
}

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

    const hasPermission = await permissionCheckUseCase({
        roleId: privateDecoded.roleId,
        path: formatPath(req.originalUrl),
    });

    if (!hasPermission) throw new HttpError(403, 'Forbidden');

    req.user = {
        pid: privateDecoded.userPid,
        id: privateDecoded.userId,
        email: privateDecoded.userEmail,
    };

    next();
}
