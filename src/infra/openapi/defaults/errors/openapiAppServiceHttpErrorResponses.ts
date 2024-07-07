import {guardErrors} from './guardErrors';
import {internalServerErrors} from './internalServerErrors';
import {rateLimitErrors} from './rateLimitErrors';

export const openapiAppServiceHttpErrorResponses = [...internalServerErrors, ...guardErrors, ...rateLimitErrors];
