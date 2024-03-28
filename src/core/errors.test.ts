import {expect, test} from 'vitest';
import {GuardError, HttpError, InternalError} from './errors';

test('InternalError', () => {
    const errorMessage = 'Internal server error';
    const errorBody = {reason: 'Database connection failure'};

    const internalError = new InternalError(errorMessage, errorBody);

    expect(internalError.message).toBe(errorMessage);
    expect(internalError.body).toBe(errorBody);
    expect(internalError.name).toBe('InternalError');
});

test('HttpError', () => {
    const errorCode = 404;
    const errorMessage = 'Not Found';
    const errorBody = {reason: 'Resource not found'};

    const httpError = new HttpError(errorCode, errorMessage, errorBody);

    expect(httpError.message).toBe(errorMessage);
    expect(httpError.code).toBe(errorCode);
    expect(httpError.body).toBe(errorBody);
    expect(httpError.name).toBe('HttpError');
});

test('GuardError', () => {
    const errorCode = 422;
    const errorMessage = 'Validation failed';
    const errorKey = 'email';
    const errorBody = {reason: 'Invalid email format'};

    const guardError = new GuardError(errorMessage, errorKey, errorBody);

    expect(guardError.message).toBe(errorMessage);
    expect(guardError.code).toBe(errorCode); // It's inherited from HttpError
    expect(guardError.key).toBe(errorKey);
    expect(guardError.body).toEqual(
        expect.objectContaining({
            key: errorKey,
            message: errorMessage,
            reason: 'Invalid email format',
        }),
    );
    expect(guardError.name).toBe('GuardError');
});
