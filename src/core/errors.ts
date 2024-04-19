/**
 * Represents an internal error.
 *
 * @class
 * @extends Error
 */
export class InternalError extends Error {
    public body?: object;

    constructor(message: string, body?: object) {
        super(message);
        this.name = 'InternalError';
        this.body = body;
    }
}

/**
 * Represents an HTTP error.
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
