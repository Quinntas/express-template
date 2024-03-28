import {Router} from 'express';
import {route} from '../../../../core/handleRequest';
import {createUserUseCase} from '../../useCases/createUser/createUserUseCase';
import {loginUseCase} from '../../useCases/login/loginUseCase';

export const userRouter: Router = Router();

route(userRouter, 'post', '/create', createUserUseCase);

route(userRouter, 'post', '/login', loginUseCase);
