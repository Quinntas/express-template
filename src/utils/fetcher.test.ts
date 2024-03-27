import {expect, test, vi} from 'vitest';
import * as nodeFetch from "node-fetch";
import {request} from "./fetcher";

vi.mock("node-fetch", async () => {
    const actual: typeof nodeFetch = await vi.importActual("node-fetch");

    return {
        ...actual,
        default: vi.fn()
    };
});
const fetch = vi.mocked(nodeFetch.default);

test('Working mock', async () => {
    const body = {data: "ok"};

    fetch.mockImplementationOnce(async () =>
        new nodeFetch.Response(JSON.stringify(body), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        })
    )

    const res = await request({
        url: 'http://test.com',
        method: 'get'
    })

    expect(res.ok).toEqual(true);
    expect(res.status).toEqual(200);
    expect(res.response).toEqual(body);
});