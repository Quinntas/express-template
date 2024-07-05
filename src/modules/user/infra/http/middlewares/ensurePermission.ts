import {NextFunction, Response} from 'express';
import {HttpError} from '../../../../../core/errors';
import {forEach} from '../../../../../utils/iterators';
import {UserRolesEnum} from '../../../domain/user';
import {UserDecodedExpressRequest} from '../userDecodedExpressRequest';

export async function ensurePermission(allowedRoles: UserRolesEnum[], req: UserDecodedExpressRequest<null, null>, _res: Response, next: NextFunction) {
    forEach(allowedRoles, (role) => {
        if (role === req.user.role) return next();
    });

    throw new HttpError(403, 'Forbidden');
}
