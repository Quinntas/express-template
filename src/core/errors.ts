export class InternalError extends Error {
    public body?: object;

    constructor(message: string, body?: object) {
        super(message);
        this.name = "InternalError";
        this.body = body;
    }
}

export class HttpError extends Error {
    public code: number;
    public body?: object;

    constructor(code: number, message?: string, body?: object) {
        super(message);
        this.name = "HttpError";
        this.code = code;
        this.body = body;
    }
}

export class GuardError extends HttpError {
    public message: string;
    public key: string;

    constructor(message: string, key: string, body?: object) {
        super(422, message, {
            key,
            message,
            ...body
        });
        this.key = key;
        this.message = message;
        this.name = "GuardError";
    }
}