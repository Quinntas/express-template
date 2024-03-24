import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {handleError,} from "./handleRequest";
import {ErrorRequestHandler, NextFunction, RequestHandler, Response} from "express";

export type MiddlewareFunction = (req: DecodedExpressRequest<any, any>, res: Response, next: NextFunction) => Promise<void>;

export async function handleMiddleware<iBody extends object, iQuery extends object>(req: DecodedExpressRequest<iBody, iQuery>, res: Response, next: Function, middleware: Function) {
    try {
        return await middleware(req, res, next);
    } catch (error: any) {
        return handleError(res, error)
    }
}

export function wrapMiddlewares<iBody extends object, iQuery extends object>(middlewares: MiddlewareFunction[] = []): (RequestHandler | ErrorRequestHandler)[] {
    if (middlewares.length === 0)
        return [];
    const wrappedMiddlewares: (RequestHandler | ErrorRequestHandler)[] = [];
    for (let i = 0; i < middlewares.length; i++) {
        // @ts-ignore
        wrappedMiddlewares.push((req: DecodedExpressRequest<iBody, iQuery>, res: Response, next: Function) => {
            handleMiddleware<iBody, iQuery>(req, res, next, middlewares[i]);
        });
    }
    return wrappedMiddlewares;
}