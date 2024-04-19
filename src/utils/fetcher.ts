import fetch, {Response} from 'node-fetch';
import {InternalError} from '../core/errors';
import {Method} from '../types/methods';

interface FetcherRetryDTO {
    count: number;
    secondsDelay: number;
}

export interface FetcherDTO<BodyType> {
    url: string;
    method: Method;
    retryDTO?: FetcherRetryDTO;
    headers?: any;
    body?: BodyType;
}

export interface FetcherResponseDTO<ResponseType> {
    status: number;
    ok: boolean;
    response: ResponseType;
}

const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'cache-control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'User-Agent': 'ExpressTemplate/1.0.0',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

/**
 * Makes an HTTP request using the provided fetcherDTO object
 *
 * @param fetcherDTO - The data transfer object containing the request details
 * @returns A promise that resolves to an object containing the response details
 *          - response: The response body (if any)
 *          - ok: A boolean indicating if the response was successful
 *          - status: The HTTP status code of the response
 * @throws InternalError - If all fetch attempts fail
 */
export async function request<BodyType = any, ResponseType = any>(
    fetcherDTO: FetcherDTO<BodyType>,
): Promise<{
    response: ResponseType | undefined;
    ok: boolean;
    status: number;
}> {
    let headers = Object.assign({}, defaultHeaders, fetcherDTO.headers);
    let body: any = undefined;
    let retryDTO: FetcherRetryDTO = fetcherDTO.retryDTO || {
        count: 1,
        secondsDelay: 0,
    };

    if (fetcherDTO.body) {
        switch (headers['Content-Type']) {
            case 'application/json':
                body = JSON.stringify(fetcherDTO.body);
                break;
            case 'multipart/form-data':
                body = fetcherDTO.body;
                break;
            default:
                body = fetcherDTO.body;
        }
    }

    let response: Response | null = null;

    for (let i = 0; i < retryDTO.count; i++) {
        try {
            response = await fetch(fetcherDTO.url, {
                method: fetcherDTO.method.toUpperCase(),
                headers,
                body,
            });

            if (response.ok) break;
        } catch (err) {
            response = null;
        }

        if (i < retryDTO.count - 1 && retryDTO.secondsDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, retryDTO.secondsDelay));
        }
    }

    if (response === null) throw new InternalError('All fetch attempts failed');

    let responseBody = null;

    switch (response.headers.get('Content-Type')) {
        case 'application/json; charset=utf-8':
        case 'application/json;charset=UTF-8':
        case 'application/json':
            responseBody = await response.json();
            break;
        case 'application/ssml+xml':
            responseBody = await response.text();
            break;
        case 'audio/webm; codec=opus':
        case 'audio/wav':
        case 'audio/x-wav':
            responseBody = await response.blob();
            break;
        default:
            responseBody = await response.text();
    }

    return {
        status: response.status,
        ok: response.ok,
        response: responseBody ? (responseBody as ResponseType) : undefined,
    };
}
