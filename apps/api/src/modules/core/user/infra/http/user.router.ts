import {Router} from 'express';
import {post} from '../../../../../lib/handler';
import {userLoginController} from '../../useCases/userLogin/userLogin.controller';

export const userRouter: Router = Router();

post(userRouter, '/login', userLoginController);
