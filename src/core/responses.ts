import {Response} from "express";

export function objectResponse<T extends object>(data: T): T {
    return data;
}

export function jsonResponse<T extends object>(res: Response, code: number, data: T): T {
    res.setHeader("Content-Type", "application/json");
    res.status(code);
    res.json(data);
    return data;
}

export function textResponse(res: Response, code: number, data: string): string {
    res.setHeader("Content-Type", "text/plain");
    res.status(code);
    res.send(data);
    return data;
}

export function htmlResponse(res: Response, code: number, data: string): string {
    res.setHeader("Content-Type", "text/html");
    res.status(code);
    res.send(data);
    return data;
}

