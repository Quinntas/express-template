import {OpenapiUseCaseSchemaConfigResponse} from '../../../../../../infra/openapi/contructors/useCaseConstructor';

export const rateLimitOpenapi: OpenapiUseCaseSchemaConfigResponse[] = [
    {
        code: 429,
        description: 'Rate limit exceeded',
        schema: {
            message: {
                type: 'string',
                example: 'Rate limit exceeded',
                default: 'Rate limit exceeded',
            },
        },
    },
    {
        code: 401,
        description: 'Could not get client IP address',
        schema: {
            message: {
                type: 'string',
                example: 'Could not get client IP address',
                default: 'Could not get client IP address',
            },
        },
    },
];
