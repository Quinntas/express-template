import {Response} from 'express';
import {Result} from 'ts-results';
import {DecodedExpressRequest} from './decodedExpressRequest';
import {HttpResponse} from './responses';

export type ControllerFunction<Body extends object | null, Query extends object | null = null> = (
    req: DecodedExpressRequest<Body, Query>,
    res: Response,
) => Promise<Result<HttpResponse<any>, Error>>;
