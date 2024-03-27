import {expect, test, vi} from 'vitest';
import {Response, Router} from 'express';
import {handleRequest, route} from "./handleRequest";
import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {InternalError} from "./errors";
import {jsonResponse} from "./responses";

vi.mock('express', () => ({
    Request: {
        setHeader: vi.fn(),
        status: vi.fn(),
        json: vi.fn(),
    },
    Response: {
        setHeader: vi.fn(),
        status: vi.fn(),
        json: vi.fn(),
    },
    Router: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('./responses', () => ({
    jsonResponse: vi.fn(),
}));

vi.mock(`../utils/env`, () => ({
    env: {
        NODE_ENV: 'development',
    },
}));


test('Handle request - Handle Internal error - Development', async () => {
    const body = {key: 'value'} as const;

    const mockReq: DecodedExpressRequest<typeof body, null> = {} as DecodedExpressRequest<typeof body, null>;
    mockReq.headers = {'content-type': 'application/json'};
    mockReq.method = 'get';
    mockReq.body = body;
    mockReq.url = '/test';

    const mockRes: Response = {} as Response;

    const error = new InternalError('Test Error');

    const handler = vi.fn().mockRejectedValue(error);

    const result = await handleRequest(mockReq, mockRes, handler);

    expect(result).toBeUndefined();
    expect(jsonResponse).toHaveBeenCalledWith(mockRes, 500, {
        message: error.message,
    });
})

test('Handle request - Route', () => {
    // @ts-ignore
    const mockRouter: Router = vi.mocked(Router);
    const path = '/test';
    const method = 'get';
    const handler = vi.fn();

    route(mockRouter, method, path, handler);

    expect(mockRouter[method]).toHaveBeenCalledWith(path, [], expect.any(Function));
});

test('Handle request - POST JSON Content-Type', async () => {
    const body = {key: 'value'} as const;

    const mockReq: DecodedExpressRequest<typeof body, null> = {} as DecodedExpressRequest<typeof body, null>;
    const mockRes: Response = {} as Response;
    const handler = vi.fn();

    mockReq.headers = {'content-type': 'application/json'};
    mockReq.method = 'post';
    mockReq.body = body;
    mockReq.url = '/test';

    const result = await handleRequest<typeof body, null>(mockReq, mockRes, handler);

    expect(mockReq.bodyObject).toEqual(mockReq.body);
    expect(handler).toHaveBeenCalledWith(mockReq, mockRes);
    expect(result).toBeUndefined();
});

test('Handle request - GET with query params', async () => {
    const query = {query: 'value'} as const;

    const mockReq: DecodedExpressRequest<null, typeof query> = {} as DecodedExpressRequest<null, typeof query>;
    const mockRes: Response = {} as Response;
    const handler = vi.fn();

    mockReq.headers = {'content-type': 'application/json'};
    mockReq.method = 'get';
    mockReq.body = null;
    mockReq.url = '/test?query=value';

    const result = await handleRequest<null, typeof query>(mockReq, mockRes, handler);

    expect(mockReq.bodyObject).toEqual(mockReq.body);
    expect(mockReq.queryObject).toEqual(query);
    expect(handler).toHaveBeenCalledWith(mockReq, mockRes);
    expect(result).toBeUndefined();
});