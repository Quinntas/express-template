import {Request, Response, Router} from 'express';
import {parse} from 'querystring';
import {DecodedExpressRequest} from '../types/decodedExpressRequest';
import {Method} from '../types/methods';
import {env} from '../utils/env';
import {HttpError, InternalError} from './errors';
import {MiddlewareFunction, wrapMiddlewares} from './middleware';
import {jsonResponse} from './responses';

// TODO: mysql2 error handling
export function handleError(res: Response, error: Error) {
    switch (true) {
        case error instanceof HttpError:
            return jsonResponse(res, error.code, {
                message: error.message,
                ...error.body,
            });
        case error instanceof InternalError:
            if (env.NODE_ENV === 'development') {
                console.error(error);
                return jsonResponse(res, 500, {
                    message: error.message,
                    ...error.body,
                });
            }
            break;
    }
    console.error(error);
    return jsonResponse(res, 500, {message: 'Internal server error'});
}

export async function handleRequest<iBody extends object | null, iQuery extends object | null>(req: DecodedExpressRequest<iBody, iQuery>, res: Response, handler: Function) {
    switch (req.headers['content-type']) {
        case 'application/json;charset=utf-8':
        case 'application/json':
            req.bodyObject = req.body;
            break;
    }

    req.queryObject = parse(req.url.split('?')[1]) as iQuery;

    try {
        return await handler(req, res);
    } catch (error: any) {
        return handleError(res, error);
    }
}

export function route<iBody extends object, iQuery extends object>(
    router: Router,
    method: Method,
    path: string,
    handler: Function,
    middlewares: MiddlewareFunction[] = [],
) {
    const wrappedMiddlewares = wrapMiddlewares<iBody, iQuery>(middlewares);
    router[method](path, wrappedMiddlewares, (req: Request, res: Response) =>
        handleRequest<iBody, iQuery>(req as DecodedExpressRequest<iBody, iQuery>, res, handler),
    );
}
