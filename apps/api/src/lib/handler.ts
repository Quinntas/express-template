import {Request, Response, Router} from 'express';
import {parse} from 'node:querystring';
import {Err, Result} from 'ts-results';
import {httpErrorHandler} from './errors';
import {MiddlewareFunction, wrapMiddlewares} from './middleware';
import {HttpResponse, htmlResponse, jsonResponse, textResponse} from './responses';
import {ControllerFunction} from './types/controller';
import {DecodedExpressRequest} from './types/decodedExpressRequest';
import {Method} from './types/methods';

export function decodeRequest<Body extends object | null, Query extends object | null = null>(req: Request): DecodedExpressRequest<Body, Query> {
    const decodedRequest: DecodedExpressRequest<Body, Query> = req as DecodedExpressRequest<Body, Query>;

    decodedRequest.decoded = {
        body: {} as Body,
        query: {} as Query,
    };

    switch (req.headers['content-type']) {
        case 'application/json;charset=utf-8':
        case 'application/json':
            decodedRequest.decoded.body = req.body;
            break;
    }

    decodedRequest.decoded.query = parse(req.url.split('?')[1]) as Query;

    return decodedRequest;
}

export async function httpController<Body extends object | null, Query extends object | null = null>(
    req: Request,
    res: Response,
    controller: ControllerFunction<Body, Query>,
) {
    let result: Result<HttpResponse<any>, Error>;

    try {
        result = await controller(decodeRequest<Body, Query>(req), res);
    } catch (error: unknown) {
        result = Err(error as Error);
    }

    if (!result.ok) return httpErrorHandler(res, result.val);

    const statusCode = result.val.statusCode ?? 200;
    const contentType = result.val.contentType ?? 'json';

    switch (contentType) {
        case 'json':
            return jsonResponse(res, statusCode, result.val.data);
        case 'html':
            return htmlResponse(res, statusCode, result.val.data);
        case 'text':
            return textResponse(res, statusCode, result.val.data);
    }
}

export function route<Body extends object | null, Query extends object | null = null>(
    router: Router,
    method: Method,
    path: string,
    controller: ControllerFunction<Body, Query>,
    middlewares: MiddlewareFunction[] = [],
) {
    router[method](path, wrapMiddlewares(middlewares), (req: Request, res: Response) => httpController<Body, Query>(req, res, controller));
}

export function post<Body extends object | null, Query extends object | null = null>(
    router: Router,
    path: string,
    controller: ControllerFunction<Body, Query>,
    middlewares: MiddlewareFunction[] = [],
) {
    route<Body, Query>(router, 'post', path, controller, middlewares);
}

export function get<Body extends object | null, Query extends object | null = null>(
    router: Router,
    path: string,
    controller: ControllerFunction<Body, Query>,
    middlewares: MiddlewareFunction[] = [],
) {
    route<Body, Query>(router, 'get', path, controller, middlewares);
}

export function put<Body extends object | null, Query extends object | null = null>(
    router: Router,
    path: string,
    controller: ControllerFunction<Body, Query>,
    middlewares: MiddlewareFunction[] = [],
) {
    route<Body, Query>(router, 'put', path, controller, middlewares);
}

export function patch<Body extends object | null, Query extends object | null = null>(
    router: Router,
    path: string,
    controller: ControllerFunction<Body, Query>,
    middlewares: MiddlewareFunction[] = [],
) {
    route<Body, Query>(router, 'patch', path, controller, middlewares);
}
