import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {Request, Response, Router} from "express";
import {parse} from "querystring";
import {HttpError} from "./errors";
import {jsonResponse} from "./responses";

export async function handleRequest<iBody, iQuery>(
    req: DecodedExpressRequest<iBody, iQuery>,
    res: Response,
    handler: Function
) {
    switch (req.headers["content-type"]) {
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
        }

        return jsonResponse(res, 500, {message: "Internal Server Error"});
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