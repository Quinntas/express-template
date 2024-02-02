import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {Request, Response, Router} from "express";
import {parse} from "querystring";
import {HttpError} from "./errors";
import {jsonResponse} from "./responses";
import {Result, SpectreError} from "spectre-orm";

export async function handleRequest<iBody, iQuery>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    handler: Function
) {
    switch (req.headers["content-type"]) {
        case "application/json;charset=utf-8":
        case "application/json":
            req.bodyObject = req.body;
            break;
    }

    req.queryObject = parse(req.url.split("?")[1]) as iQuery;

    try {
        return await handler(req, res);
    } catch (error) {
        if (error instanceof HttpError) {
            return jsonResponse(
                res,
                error.code,
                error.body || {message: error.message}
            );
        } else if (error instanceof Result) {
            switch (error.errorType) {
                case SpectreError.DATABASE_DUPLICATE_ENTRY:
                    return jsonResponse(res, 400, {message: "Duplicate entry"});
                case SpectreError.DATABASE_WRONG_VALUE:
                case SpectreError.DATABASE_BAD_REQUEST:
                case SpectreError.DATABASE_INTERNAL_ERROR:
                    return jsonResponse(res, 500, {message: "Database internal error"});
            }
        }

        console.log(error)

        return jsonResponse(res, 500, {message: "Internal server error"});
    }
}

export function get<iBody = any, iQuery = any>(
    router: Router,
    path: string,
    handler: Function,
) {
    router.get(path, (req: Request, res: Response) => {
        handleRequest<iBody, iQuery>(
            req as DecodedExpressRequest<iBody, iQuery>,
            res,
            handler
        );
    });
}

export function post<iBody = any, iQuery = any>(
    router: Router,
    path: string,
    handler: Function,
) {
    router.post(path, (req: Request, res: Response) => {
        handleRequest<iBody, iQuery>(
            req as DecodedExpressRequest<iBody, iQuery>,
            res,
            handler
        );
    });
}