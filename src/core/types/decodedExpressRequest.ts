import {Request} from 'express';

/**
 * Represents a decoded Express request with specific properties.
 * @interface
 * @extends Request
 * @template iBody - The type of the request body object.
 * @template iQuery - The type of the request query object.
 */
export interface DecodedExpressRequest<iBody extends object | null, iQuery extends object | null> extends Request {
    bodyObject: Partial<iBody>;
    queryObject: Partial<iQuery>;
}
