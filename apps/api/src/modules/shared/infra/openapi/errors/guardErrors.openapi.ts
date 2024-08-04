import {OpenapiUseCaseSchemaConfigResponse} from '../../../../../infra/openapi/contructors/useCaseConstructor';

export const guardErrorsOpenapi: OpenapiUseCaseSchemaConfigResponse[] = [
    {
        code: 422,
        description: 'Guard validation error',
        schema: {
            key: {
                type: 'string',
                example: 'email',
            },
            message: {
                type: 'string',
                example: 'email is required',
            },
        },
    },
];
