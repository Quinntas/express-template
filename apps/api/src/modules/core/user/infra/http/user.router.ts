import {Router} from 'express';
import {get, post} from '../../../../../lib/web/handler';
import {UserRolesEnum} from '../../domain/user';
import {userListController} from '../../useCases/userList/userList.controller';
import {userLoginController} from '../../useCases/userLogin/userLogin.controller';
import {ensureUserAuthenticatedMiddleware} from './middlewares/ensureAuthenticated/ensureAuthenticated.middleware';
import {ensurePermissionMiddleware} from './middlewares/ensurePermission/ensurePermission.middleware';

export const userRouter: Router = Router();

post(userRouter, '/login', userLoginController);

get(userRouter, '/', userListController, [
    ensureUserAuthenticatedMiddleware,
    (req, res, next) =>
        ensurePermissionMiddleware([UserRolesEnum.ADMIN], req, res, next),
]);
