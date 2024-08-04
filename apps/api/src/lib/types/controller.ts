import {Response} from 'express';
import {Result} from 'ts-results';
import {HttpResponse} from '../responses';
import {DecodedExpressRequest} from './decodedExpressRequest';

export type ControllerFunction<Body extends object | null, Query extends object | null = null> = (
    req: DecodedExpressRequest<Body, Query>,
    res: Response,
) => Promise<Result<HttpResponse<any>, Error>>;
