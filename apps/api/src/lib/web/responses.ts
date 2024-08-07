import {Response} from 'express';

/**
 * The HttpResponse type is a generic type that is used to define the structure of the response object.
 * Status code defaults to 200, and content type defaults to 'json'.
 *
 * @template T - The type of the data object in the response.
 */
export interface HttpResponse<T> {
    data: T;
    statusCode?: number;
    contentType?: 'json' | 'text' | 'html';
}

/**
 * Sets the response headers and body with JSON data and status code.
 *
 * @param {Response} res - The response object.
 * @param {number} code - The status code to set for the response.
 * @param {T} data - The data object to be converted to JSON and sent in the response body.
 * @returns {T} - The same data object that was sent in the response body.
 */
export function jsonResponse<T extends object>(
    res: Response,
    code: number,
    data: T,
): T {
    res.setHeader('Content-Type', 'application/json');
    res.status(code);
    res.json(data);
    return data;
}

/**
 * Set the content type of the response to text/plain, set the HTTP status code, send data to response, and return the data.
 *
 * @param {Response} res - The response object
 * @param {number} code - The HTTP status code
 * @param {string} data - The data to be sent in the response
 *
 * @return {string} - The data that was sent in the response
 */
export function textResponse(
    res: Response,
    code: number,
    data: string,
): string {
    res.setHeader('Content-Type', 'text/plain');
    res.status(code);
    res.send(data);
    return data;
}

/**
 * Set the response to be an HTML content type and send the data to the client.
 *
 * @param {Response} res - The response object.
 * @param {number} code - The status code to set for the response.
 * @param {string} data - The HTML data to send to the client.
 * @return {string} - The HTML data that was sent to the client.
 */
export function htmlResponse(
    res: Response,
    code: number,
    data: string,
): string {
    res.setHeader('Content-Type', 'text/html');
    res.status(code);
    res.send(data);
    return data;
}
