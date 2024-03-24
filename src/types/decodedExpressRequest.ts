import {Request} from 'express';
import {Method} from './methods';

export interface DecodedExpressRequest<iBody extends object | null, iQuery extends object | null> extends Request {
    method: Method;
    bodyObject: Partial<iBody>;
    queryObject: Partial<iQuery>;
}
