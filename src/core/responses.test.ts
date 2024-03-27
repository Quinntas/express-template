import {expect, test, vi} from 'vitest';
import {Response} from 'express';
import {htmlResponse, jsonResponse, objectResponse, textResponse} from "./responses";

vi.mock('express', () => {
    return {
        Response: {
            setHeader: vi.fn(),
            status: vi.fn(),
            json: vi.fn(),
            send: vi.fn(),
        },
    };
});

test('objectResponse', () => {
    const testData = {message: 'Hello, world!'};
    const response = objectResponse(testData);

    expect(response).toEqual(testData);
});

test('jsonResponse', () => {
    // @ts-ignore
    const mockRes: Response = vi.mocked(Response);
    const testData = {message: 'Hello, world!'};
    const code = 200;

    const result = jsonResponse(mockRes, code, testData);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockRes.status).toHaveBeenCalledWith(code);
    expect(mockRes.json).toHaveBeenCalledWith(testData);
    expect(result).toEqual(testData);
});

test('textResponse', () => {
    // @ts-ignore
    const mockRes: Response = vi.mocked(Response);
    const testData = 'Hello, world!';
    const code = 200;

    const result = textResponse(mockRes, code, testData);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(mockRes.status).toHaveBeenCalledWith(code);
    expect(mockRes.send).toHaveBeenCalledWith(testData);
    expect(result).toEqual(testData);
});

test('htmlResponse', () => {
    // @ts-ignore
    const mockRes: Response = vi.mocked(Response);
    const testData = '<html><body>Hello, world!</body></html>';
    const code = 200;

    const result = htmlResponse(mockRes, code, testData);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
    expect(mockRes.status).toHaveBeenCalledWith(code);
    expect(mockRes.send).toHaveBeenCalledWith(testData);
    expect(result).toEqual(testData);
});
