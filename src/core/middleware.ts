import {ErrorRequestHandler, NextFunction, Request, RequestHandler, Response} from 'express';
import {forEach} from '../utils/iterators';
import {handleError} from './handler';
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
export type MiddlewareFunction = (req: DecodedExpressRequest<any, any>, res: Response, next: NextFunction) => Promise<void>;

export async function middlewareHandler<iBody extends object | null, iQuery extends object | null>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    next: Function,
    middleware: Function,
) {
    try {
        return await middleware(req, res, next);
    } catch (error: any) {
        return handleError(res, error);
    }
}

export function wrapMiddlewares<iBody extends object, iQuery extends object>(middlewares: MiddlewareFunction[] = []): (RequestHandler | ErrorRequestHandler)[] {
    if (middlewares.length === 0) return [];
    const wrappedMiddlewares: (RequestHandler | ErrorRequestHandler)[] = [];
    forEach(middlewares, (middleware) => {
        wrappedMiddlewares.push((req: Request, res: Response, next: Function) => {
            middlewareHandler<iBody, iQuery>(req as DecodedExpressRequest<iBody, iQuery>, res, next, middleware);
        });
    });
    return wrappedMiddlewares;
}
