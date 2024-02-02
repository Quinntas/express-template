import {post} from "../../../core/handleRequest";
import {CreateUserUseCase} from "../useCases/createUser/createUserUseCase";
import {Router} from "express";

export const userRouter: Router = Router();

post(userRouter, '/', CreateUserUseCase)
