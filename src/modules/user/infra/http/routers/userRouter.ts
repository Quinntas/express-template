import {Router} from 'express';
import {post} from '../../../../../core/handler';
import {userCreateUseCase} from '../../../useCases/userCreate/userCreateUseCase';
import {userLoginUseCase} from '../../../useCases/userLogin/userLoginUseCase';

export const userRouter: Router = Router();

post(userRouter, '/create', userCreateUseCase);

post(userRouter, '/login', userLoginUseCase);
