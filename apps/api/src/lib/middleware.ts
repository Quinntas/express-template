import {ErrorRequestHandler, NextFunction, Request, RequestHandler, Response} from 'express';
import {Err, Result} from 'ts-results';
import {forEach} from 'typescript-utils/src/iterators';
import {HttpError, httpErrorHandler} from './errors';
import {decodeRequest} from './handler';
import {DecodedExpressRequest} from './types/decodedExpressRequest';

/**
 * MiddlewareFunction is a type definition for a middleware function that is used in Express.js applications.
 * It takes three parameters: req, res, and next, and returns a Promise<void>.
 *
 * @param {DecodedExpressRequest<any, any>} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 *
 * @returns {Promise<void>}
 */
export type MiddlewareFunction = (req: DecodedExpressRequest<any, any>, res: Response, next: NextFunction) => Promise<Result<void, HttpError>>;

export async function middlewareHandler<Body extends object | null, Query extends object | null = null>(
    req: Request,
    res: Response,
    next: NextFunction,
    middleware: MiddlewareFunction,
) {
    let result: Result<NextFunction | void, HttpError>;

    try {
        result = await middleware(decodeRequest<Body, Query>(req), res, next);
    } catch (error: unknown) {
        result = Err(error as HttpError);
    }

    if (result.err) return httpErrorHandler(res, result);

    return;
}

export function wrapMiddlewares<Body extends object, Query extends object>(middlewares: MiddlewareFunction[] = []): (RequestHandler | ErrorRequestHandler)[] {
    if (middlewares.length === 0) return [];
    const wrappedMiddlewares: (RequestHandler | ErrorRequestHandler)[] = [];
    forEach(middlewares, (middleware) => {
        wrappedMiddlewares.push((req: Request, res: Response, next: NextFunction) => {
            middlewareHandler<Body, Query>(req, res, next, middleware);
        });
    });
    return wrappedMiddlewares;
}
