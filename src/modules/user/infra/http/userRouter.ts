import {post} from "../../../../core/handleRequest";
import {CreateUserUseCase} from "../../useCases/createUser/createUserUseCase";
import {Router} from "express";
import {LoginUseCase} from "../../useCases/login/loginUseCase";
import {userRateLimitMiddleware} from "../middleware/rateLimit/userRateLimitMiddleware";

export const userRouter: Router = Router();

post(userRouter, '/create', CreateUserUseCase, [userRateLimitMiddleware])

post(userRouter, '/login', LoginUseCase, [userRateLimitMiddleware])

