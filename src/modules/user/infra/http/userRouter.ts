import {get, post} from "../../../../core/handleRequest";
import {CreateUserUseCase} from "../../useCases/createUser/createUserUseCase";
import {Router} from "express";
import {GetUserUseCase} from "../../useCases/getUser/getUserUseCase";
import {LoginUseCase} from "../../useCases/login/loginUseCase";
import {ensureUserAuthenticated} from "../middleware/userMiddleware";

export const userRouter: Router = Router();

post(userRouter, '/', CreateUserUseCase)

post(userRouter, '/login', LoginUseCase)

get(userRouter, '/', GetUserUseCase, [ensureUserAuthenticated])
