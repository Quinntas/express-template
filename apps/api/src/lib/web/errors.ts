import {Response} from 'express';
import {env} from '../../common/env';
import {log} from '../../modules/shared/infra/log';
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

export class MapperError extends InternalError {
    constructor(message: string, body?: object) {
        super(message, {
            message,
            ...body,
        });
        this.name = 'MapperError';
    }
}

export interface RepoErrorBody {
    code: string;
    sqlMessage: string;
    sqlState: string;
    sql: string;
}

export enum RepoErrorCodes {
    ER_DUP_ENTRY = 'ER_DUP_ENTRY',
    ER_UNKNOWN = 'ER_UNKNOWN',
    ER_NO_RECORD = 'ER_NO_RECORD',
}

export class RepoError extends InternalError {
    public declare body: RepoErrorBody;
    public errorCode: RepoErrorCodes;

    constructor(
        message: string,
        body?: RepoErrorBody,
        errorCode: RepoErrorCodes = RepoErrorCodes.ER_UNKNOWN,
    ) {
        super(message, {
            message,
            ...body,
        });
        this.errorCode = body ? (body.code as RepoErrorCodes) : errorCode;
        this.name = 'RepoError';
    }
}

export function httpErrorHandler(res: Response, error: unknown) {
    if (env.NODE_ENV === 'development') log.error(error);

    switch (true) {
        case error instanceof HttpError:
            return jsonResponse(res, error.code, {
                message: error.message,
                ...error.body,
            });

        case error instanceof InternalError:
            if (env.NODE_ENV === 'development')
                return jsonResponse(res, 500, {
                    message: error.message,
                    ...error.body,
                });
            break;
    }

    return jsonResponse(res, 500, {message: 'Internal server error'});
}
