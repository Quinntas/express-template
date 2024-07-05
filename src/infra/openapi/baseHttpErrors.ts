import {internalServerErrors} from "./internalServerErrors";
import {guardErrors} from "./guardErrors";
import {rateLimitErrors} from "./rateLimitErrors";

export const baseHttpErrors = {
    ...internalServerErrors,
    ...guardErrors,
    ...rateLimitErrors
}