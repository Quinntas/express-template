import {Response} from 'express';
import {env} from '../common/env';
import {jsonResponse} from './responses';

/**
 * Represents an HTTP error.
 * @extends Error
 */
export class HttpError extends Error {
    public code: number;
    public body?: object;

    constructor(code: number, message?: string, body?: object) {
        super(message);
        this.name = 'HttpError';
        this.code = code;
        this.body = body;
    }
}

/**
 * Represents an internal error.
 *
 * @class
 * @extends Error
 */
export class InternalError extends HttpError {
    public body?: object;

    constructor(message: string, body?: object) {
        super(500, message, body);
        this.code = 500;
        this.name = 'InternalError';
        this.body = body;
    }
}

/**
 * Represents an error that occurs when validating user input.
 * Inherits from HttpError.
 *
 * @class
 * @extends {HttpError}
 */
export class GuardError extends HttpError {
    public message: string;
    public key: string;

    constructor(message: string, key: string, body?: object) {
        super(422, message, {
            key,
            message,
            ...body,
        });
        this.key = key;
        this.message = message;
        this.name = 'GuardError';
    }
}

export function httpErrorHandler(res: Response, error: Error) {
    switch (true) {
        case error instanceof HttpError:
            console.error(error);
            return jsonResponse(res, error.code, {
                message: error.message,
                ...error.body,
            });

        case error instanceof InternalError:
            if (env.NODE_ENV === 'development') {
                console.error(error);
                return jsonResponse(res, 500, {
                    message: error.message,
                    ...error.body,
                });
            }
            break;

        default: {
            const properties = Object.getOwnPropertyNames(error);
            if (properties.includes('sql') && properties.includes('sqlMessage') && properties.includes('code')) {
                if ((error as any)['code'] === 'ER_DUP_ENTRY')
                    return jsonResponse(res, 409, {
                        message: error.message,
                    });
            }
            break;
        }
    }

    // Error outside of error boundries
    console.error(error);
    return jsonResponse(res, 500, {message: 'Internal server error'});
}
