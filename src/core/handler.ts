import {Request, Response, Router} from 'express';
import {parse} from 'querystring';
import {httpErrorHandler} from './errors';
import {MiddlewareFunction, wrapMiddlewares} from './middleware';
import {DecodedExpressRequest} from './types/decodedExpressRequest';
import {Method} from './types/methods';

type UseCaseFunction = (req: DecodedExpressRequest<any, any>, res: Response) => Promise<any>;

export async function httpController<iBody extends object | null, iQuery extends object | null>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    useCase: UseCaseFunction,
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
        return httpErrorHandler(res, error);
    }
}

export function route<iBody extends object, iQuery extends object>(
    router: Router,
    method: Method,
    path: string,
    useCase: UseCaseFunction,
    middlewares: MiddlewareFunction[] = [],
) {
    router[method](path, wrapMiddlewares<iBody, iQuery>(middlewares), (req: Request, res: Response) =>
        httpController<iBody, iQuery>(req as DecodedExpressRequest<iBody, iQuery>, res, useCase),
    );
}

export function post<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    useCase: UseCaseFunction,
    middlewares: MiddlewareFunction[] = [],
) {
    route<iBody, iQuery>(router, 'post', path, useCase, middlewares);
}

export function get<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    useCase: UseCaseFunction,
    middlewares: MiddlewareFunction[] = [],
) {
    route<iBody, iQuery>(router, 'get', path, useCase, middlewares);
}

export function put<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    useCase: UseCaseFunction,
    middlewares: MiddlewareFunction[] = [],
) {
    route<iBody, iQuery>(router, 'put', path, useCase, middlewares);
}

export function patch<iBody extends object, iQuery extends object>(
    router: Router,
    path: string,
    useCase: UseCaseFunction,
    middlewares: MiddlewareFunction[] = [],
) {
    route<iBody, iQuery>(router, 'patch', path, useCase, middlewares);
}
