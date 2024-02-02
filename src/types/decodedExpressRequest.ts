import {Request} from "express";
import {Method} from "./methods";

export interface DecodedExpressRequest<iBody, iQuery> extends Request {
    method: Method;
    bodyObject: iBody;
    queryObject: iQuery;
}