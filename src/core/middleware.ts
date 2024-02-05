import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {handleError} from "./handleRequest";
import {Response} from "express";

export async function handleMiddleware<iBody, iQuery>(req: DecodedExpressRequest<iBody, iQuery>, res: Response, next: Function, middleware: Function) {
    try {
        return await middleware(req, res, next);
    } catch (error) {
        return handleError(res, error)
    }
}