import {Router} from 'express';
import {post} from '../../../../core/handleRequest';
import {CreateUserUseCase} from '../../useCases/createUser/createUserUseCase';
import {LoginUseCase} from '../../useCases/login/loginUseCase';

export const userRouter: Router = Router();

post(userRouter, '/create', CreateUserUseCase);

post(userRouter, '/login', LoginUseCase);
