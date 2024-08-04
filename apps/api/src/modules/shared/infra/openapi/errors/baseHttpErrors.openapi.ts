import {rateLimitOpenapi} from '../../http/middlewares/rateLimit/rateLimit.openapi';
import {guardErrorsOpenapi} from './guardErrors.openapi';
import {internalServerErrorsOpenapi} from './internalServerErrors.openapi';

export const baseHttpErrorsOpenapi = [...internalServerErrorsOpenapi, ...guardErrorsOpenapi, ...rateLimitOpenapi];
