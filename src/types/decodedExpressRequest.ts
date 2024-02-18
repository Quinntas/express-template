import {Request} from "express";
import {Method} from "./methods";

export interface DecodedExpressRequest<iBody extends object, iQuery extends object> extends Request {
    method: Method;
    bodyObject: iBody;
    queryObject: iQuery;
}