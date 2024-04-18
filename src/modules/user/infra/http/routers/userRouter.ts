import {Router} from 'express';
import {route} from '../../../../../core/handleRequest';
import {userCreateUseCase} from '../../../useCases/useCreate/userCreateUseCase';
import {userLoginUseCase} from '../../../useCases/userLogin/userLoginUseCase';

export const userRouter: Router = Router();

route(userRouter, 'post', '/create', userCreateUseCase);

route(userRouter, 'post', '/login', userLoginUseCase);
