import {Err, Ok, Result} from 'ts-results';
import {map} from 'typescript-utils/src/iterators';
import {Method} from '../lib/web/methods';

interface RequestRetryDTO {
    count: number;
    secondsDelay: number;
}

export interface RequestDTO<BodyType> {
    url: string;
    method: Method;
    retryDTO?: RequestRetryDTO;
    headers?: Record<string, string>;
    body?: BodyType;
}

export interface RequestResponseDTO<ResponseType> {
    response: Response;
    body: ResponseType;
    status: number;
    ok: boolean;
}

const defaultHeaders = {
    'content-type': 'application/json',
    accept: 'application/json',
    'cache-control': 'no-cache',
    'access-control-allow-origin': '*',
    'user-agent': 'AmazBank/1.0.0',
    'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

export async function request<BodyType = any, ResponseType = any, ErrorType = any>(
    fetcherDTO: RequestDTO<BodyType>,
): Promise<Result<RequestResponseDTO<ResponseType>, ErrorType | Error>> {
    const headers = Object.assign({}, defaultHeaders, fetcherDTO.headers);
    let body: any = undefined;
    const retryDTO: RequestRetryDTO = fetcherDTO.retryDTO || {
        count: 1,
        secondsDelay: 0,
    };

    if (fetcherDTO.body) {
        switch (headers['content-type']) {
            case 'application/json':
                body = JSON.stringify(fetcherDTO.body);
                break;
            case 'multipart/form-data':
                body = fetcherDTO.body;
                break;
            case 'application/x-www-form-urlencoded':
                const entries = Object.entries(fetcherDTO.body);
                body = map(entries, ([key, value]) => `${key}=${value}`).join('&');
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
            if (i < retryDTO.count - 1 && retryDTO.secondsDelay > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryDTO.secondsDelay));
            }
        }
    }

    if (!response) return Err(new Error('All requests failed'));

    let responseBody = null;

    let contentType = response.headers.get('content-type');
    if (!contentType) return Err(new Error('No content type in response'));
    contentType = contentType.toLowerCase();

    switch (contentType) {
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
            return Err(new Error(`Unsupported content type: ${contentType}`));
    }

    return Ok<RequestResponseDTO<ResponseType>>({
        status: response.status,
        ok: response.ok,
        response,
        body: responseBody as ResponseType,
    });
}
