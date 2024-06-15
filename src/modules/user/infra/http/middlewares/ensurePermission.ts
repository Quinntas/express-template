import {NextFunction, Response} from 'express';
import {UserDecodedExpressRequest} from '../userDecodedExpressRequest';
import {UserRolesEnum} from "../../../domain/user";
import {forEach} from "../../../../../utils/iterators";
import {HttpError} from "../../../../../core/errors";

export async function ensurePermission(allowedRoles: UserRolesEnum[],req: UserDecodedExpressRequest<null, null>, _res: Response, next: NextFunction) {
    forEach(allowedRoles, (role) => {
        if (role === req.user.role)
            return next();
    })

    throw new HttpError(403, 'Forbidden')
}
