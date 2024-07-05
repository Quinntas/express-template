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

        default: {
            const properties = Object.getOwnPropertyNames(error);
            if (properties.includes('sql') && properties.includes('sqlMessage') && properties.includes('code')) {
                if ((error as any)['code'] === 'ER_DUP_ENTRY')
                    return jsonResponse(res, 409, {
                        message: error.message,
                    });
            }
            break;
        }
    }

    // Error outside of error boundries
    console.error(error);
    return jsonResponse(res, 500, {message: 'Internal server error'});
}

type UseCase = (req: DecodedExpressRequest<any, any>, res: Response) => Promise<any>;

export async function httpController<iBody extends object | null, iQuery extends object | null>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    useCase: UseCase,
) {
    switch (req.headers['content-type']) {
        case 'application/json;charset=utf-8':
        case 'application/json':
            req.bodyObject = req.body;
            break;
    }

    req.queryObject = parse(req.url.split('?')[1]) as iQuery;

    try {
        return await useCase(req, res);
    } catch (error: any) {
        return handleError(res, error);
    }
}

export function route<iBody extends object, iQuery extends object>(
    router: Router,
    method: Method,
    path: string,
    useCase: UseCase,
    middlewares: MiddlewareFunction[] = [],
) {
    const wrappedMiddlewares = wrapMiddlewares<iBody, iQuery>(middlewares);
    router[method](path, wrappedMiddlewares, (req: Request, res: Response) =>
        httpController<iBody, iQuery>(req as DecodedExpressRequest<iBody, iQuery>, res, useCase),
    );
}

export function post<iBody extends object, iQuery extends object>(router: Router, path: string, useCase: UseCase, middlewares: MiddlewareFunction[] = []) {
    route<iBody, iQuery>(router, 'post', path, useCase, middlewares);
}

export function get<iBody extends object, iQuery extends object>(router: Router, path: string, useCase: UseCase, middlewares: MiddlewareFunction[] = []) {
    route<iBody, iQuery>(router, 'get', path, useCase, middlewares);
}

export function put<iBody extends object, iQuery extends object>(router: Router, path: string, useCase: UseCase, middlewares: MiddlewareFunction[] = []) {
    route<iBody, iQuery>(router, 'put', path, useCase, middlewares);
}

export function patch<iBody extends object, iQuery extends object>(router: Router, path: string, useCase: UseCase, middlewares: MiddlewareFunction[] = []) {
    route<iBody, iQuery>(router, 'patch', path, useCase, middlewares);
}
