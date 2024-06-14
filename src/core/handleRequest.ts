import {Request, Response, Router} from 'express';
import {parse} from 'querystring';
import {env} from '../utils/env';
import {HttpError, InternalError} from './errors';
import {MiddlewareFunction, wrapMiddlewares} from './middleware';
import {jsonResponse} from './responses';
import {DecodedExpressRequest} from './types/decodedExpressRequest';
import {Method} from './types/methods';

/**
 * Handles errors and sends appropriate response.
 *
 * @param {Response} res - The response object.
 * @param {Error} error - The error object.
 *
 * @returns {Response} The response object.
 */
export function handleError(res: Response, error: Error) {
    switch (true) {
        case error instanceof HttpError:
            console.error(error);
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
        default:
            const properties = Object.getOwnPropertyNames(error);
            if (properties.includes('sql') && properties.includes('sqlMessage') && properties.includes('code')) {
                if ((error as any)['code'] === 'ER_DUP_ENTRY')
                    return jsonResponse(res, 409, {
                        message: error.message,
                    });
            }
            break;
    }
    console.error(error);
    return jsonResponse(res, 500, {message: 'Internal server error'});
}

/**
 * Handles an HTTP request.
 *
 * @param {DecodedExpressRequest<object | null, object | null>} req - The decoded Express request object.
 * @param {Response} res - The response object.
 * @param {Function} handler - The request handler function.
 * @returns {Promise<any>} - A promise that resolves or rejects with the result of the request handler function.
 */
export async function handleRequest<iBody extends object | null, iQuery extends object | null>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    handler: Function,
) {
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

/**
 * Adds a route to the express router with the specified method, path, and handler.
 *
 * @param {Router} router - The express router object.
 * @param {Method} method - The HTTP method for the route.
 * @param {string} path - The path for the route.
 * @param {Function} handler - The handler function for the route.
 * @param {MiddlewareFunction[]} [middlewares=[]] - An array of middleware functions to be executed before the handler.
 *
 * @return {void}
 */
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
