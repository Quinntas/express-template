import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {NextFunction, Request, Response, Router} from "express";
import {parse} from "querystring";
import {HttpError} from "./errors";
import {jsonResponse} from "./responses";
import {wrapMiddlewares} from "./middleware";

export type MiddlewareFunction = (req: DecodedExpressRequest<any, any>, res: Response, next: NextFunction) => Promise<void>;

export function handleError(res: Response, error: Error) {
    switch (true) {
        case error instanceof HttpError:
            return jsonResponse(
                res,
                error.code,
                {message: error.message, ...error.body}
            );
        default:
            console.log(error)
            return jsonResponse(res, 500, {message: "Internal server error"});
    }
}

export async function handleRequest<iBody extends object, iQuery extends object>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    handler: Function,
) {
    switch (req.headers["content-type"]) {
        case "application/json;charset=utf-8":
        case "application/json":
            req.bodyObject = req.body;
            break;
    }

    req.queryObject = parse(req.url.split("?")[1]) as iQuery;

    try {
        return await handler(req, res);
    } catch (error: any) {
        return handleError(res, error);
    }
}

export function get<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    handler: Function,
    middlewares: MiddlewareFunction[] = []
) {
    const wrappedMiddlewares = wrapMiddlewares<iBody, iQuery>(middlewares);

    router.get(path, wrappedMiddlewares, (req: Request, res: Response) => {
        handleRequest<iBody, iQuery>(
            req as DecodedExpressRequest<iBody, iQuery>,
            res,
            handler
        );
    });
}


export function post<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    handler: Function,
    middlewares: MiddlewareFunction[] = []
) {
    const wrappedMiddlewares = wrapMiddlewares<iBody, iQuery>(middlewares);

    router.post(path, wrappedMiddlewares, (req: Request, res: Response) => {
        handleRequest<iBody, iQuery>(
            req as DecodedExpressRequest<iBody, iQuery>,
            res,
            handler
        );
    });
}
