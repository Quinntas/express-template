import {Request} from 'express';
import {DeepPartial} from '../../utils/types';

export interface DecodedExpressRequest<
    Body extends object | null,
    Query extends object | null = null,
> extends Request {
    decoded: {
        body: DeepPartial<Body>;
        query: DeepPartial<Query>;
    };
}
