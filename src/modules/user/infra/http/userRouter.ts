import {Router} from 'express';
import {route} from '../../../../core/handleRequest';
import {CreateUserUseCase} from '../../useCases/createUser/createUserUseCase';
import {LoginUseCase} from '../../useCases/login/loginUseCase';

export const userRouter: Router = Router();

route(userRouter, "post", '/create', CreateUserUseCase);

route(userRouter, "post", '/login', LoginUseCase);
