import {guardErrors} from './guardErrors';
import {internalServerErrors} from './internalServerErrors';
import {rateLimitErrors} from './rateLimitErrors';

export const baseHttpErrors = {
    ...internalServerErrors,
    ...guardErrors,
    ...rateLimitErrors,
};
