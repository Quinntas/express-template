import {get, post} from "../../../core/handleRequest";
import {CreateUserUseCase} from "../useCases/createUser/createUserUseCase";
import {Router} from "express";
import {GetUserUseCase} from "../useCases/getUser/getUserUseCase";

export const userRouter: Router = Router();

post(userRouter, '/', CreateUserUseCase)
get(userRouter, '/', GetUserUseCase)
