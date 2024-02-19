import {get, post} from "../../../../core/handleRequest";
import {CreateUserUseCase} from "../../useCases/createUser/createUserUseCase";
import {Router} from "express";
import {GetUserUseCase} from "../../useCases/getUser/getUserUseCase";
import {LoginUseCase} from "../../useCases/login/loginUseCase";
import {userRateLimitMiddleware} from "../middleware/rateLimit/userRateLimitMiddleware";

export const userRouter: Router = Router();

post(userRouter, '/', CreateUserUseCase, [userRateLimitMiddleware])

post(userRouter, '/login', LoginUseCase, [userRateLimitMiddleware])

get(userRouter, '/', GetUserUseCase, [userRateLimitMiddleware])
