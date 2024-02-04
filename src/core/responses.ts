import {Response} from "express";

export function jsonResponse<T = object>(res: Response, code: number, data: T) {
    res.setHeader("Content-Type", "application/json");
    res.status(code);
    res.json(data);
}

export function textResponse(res: Response, code: number, data: string) {
    res.setHeader("Content-Type", "text/plain");
    res.status(code);
    res.send(data);
}

export function htmlResponse(res: Response, code: number, data: string) {
    res.setHeader("Content-Type", "text/html");
    res.status(code);
    res.send(data);
}

