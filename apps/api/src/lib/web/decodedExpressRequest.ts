import {Request} from 'express';

export interface DecodedExpressRequest<Body extends object | null, Query extends object | null = null> extends Request {
    decoded: {
        body: Body;
        query: Query;
    };
}
