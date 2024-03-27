import * as nodeFetch from 'node-fetch';
import {expect, test, vi} from 'vitest';
import {request} from './fetcher';

vi.mock('node-fetch', async () => {
    const actual: typeof nodeFetch = await vi.importActual('node-fetch');

    return {
        ...actual,
        default: vi.fn(),
    };
});
const fetch = vi.mocked(nodeFetch.default);

test('Fetcher - Testing mock', async () => {
    const body = {data: 'ok'};

    fetch.mockImplementationOnce(
        async () =>
            new nodeFetch.Response(JSON.stringify(body), {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            }),
    );

    const res = await request({
        url: 'http://test.com',
        method: 'get',
    });

    expect(res.ok).toEqual(true);
    expect(res.status).toEqual(200);
    expect(res.response).toEqual(body);
});

test('Fetcher - Sending body and headers', async () => {
    const body = {data: 'ok'};

    fetch.mockImplementationOnce(async (_url, options) => {
        const requestBodyString = options?.body as string | undefined;

        expect(requestBodyString).toEqual(expect.any(String));

        const parsedRequestBody = JSON.parse(requestBodyString!);

        expect(parsedRequestBody).toEqual(body);

        expect(options?.headers).toEqual(
            expect.objectContaining({
                'Content-Type': 'application/json',
            }),
        );

        return new nodeFetch.Response(JSON.stringify(body), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });
    });

    const res = await request({
        url: 'http://test.com',
        method: 'post',
        body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    expect(res.ok).toEqual(true);
    expect(res.status).toEqual(200);
    expect(res.response).toEqual(body);
});

test('Fetcher - Error', async () => {
    const body = {data: 'ok'};

    fetch.mockImplementationOnce(
        async () =>
            new nodeFetch.Response(JSON.stringify(body), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            }),
    );

    const res = await request({
        url: 'http://test.com',
        method: 'get',
    });

    expect(res.ok).toEqual(false);
    expect(res.status).toEqual(400);
    expect(res.response).toEqual(body);
});

test('Fetcher - Retries', async () => {
    const body = {data: 'ok'};

    fetch
        .mockImplementationOnce(
            async () =>
                new nodeFetch.Response(JSON.stringify(body), {
                    status: 500,
                    headers: {'Content-Type': 'application/json'},
                }),
        )
        .mockImplementationOnce(
            async () =>
                new nodeFetch.Response(JSON.stringify(body), {
                    status: 500,
                    headers: {'Content-Type': 'application/json'},
                }),
        )
        .mockImplementationOnce(
            async () =>
                new nodeFetch.Response(JSON.stringify(body), {
                    status: 200,
                    headers: {'Content-Type': 'application/json'},
                }),
        );

    const res = await request({
        url: 'http://test.com',
        method: 'get',
        retryDTO: {
            count: 3,
            secondsDelay: 0,
        },
    });

    expect(res.ok).toEqual(true);
    expect(res.status).toEqual(200);
    expect(res.response).toEqual(body);
});
