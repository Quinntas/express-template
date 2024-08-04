import {NextFunction, Response} from 'express';
import {Err, Ok} from 'ts-results';
import {forEach} from 'typescript-utils/src/iterators';
import {HttpError} from '../../../../../../../lib/errors';
import {UserRolesEnum} from '../../../../domain/user';
import {UserDecodedExpressRequest} from '../../user.decodedExpressRequest';

export async function ensurePermissionMiddleware(
    allowedRoles: UserRolesEnum[],
    req: UserDecodedExpressRequest<null, null>,
    _res: Response,
    next: NextFunction,
) {
    let hasPermission = false;

    forEach(allowedRoles, (role) => {
        if (role === req.user.role) hasPermission = true;
    });

    if (!hasPermission) return Err(new HttpError(403, 'Forbidden'));

    return Ok(next());
}
