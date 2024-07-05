import {OpenAPIV3} from 'openapi-types';
import {baseOpenAPIJsonResponse} from './jsonResponse';

export const rateLimitErrors: OpenAPIV3.ResponsesObject = {
    400: {
        description: 'Could not get client IP',
        content: {
            ...baseOpenAPIJsonResponse('Could not get client IP')
        },
    },
    429: {
        description: 'Rate limit exceeded',
        content: {
            ...baseOpenAPIJsonResponse('Rate limit exceeded')
        },
    },
};