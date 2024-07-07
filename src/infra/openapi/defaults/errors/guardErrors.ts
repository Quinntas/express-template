import {OpenapiUseCaseSchemaConfigResponse} from '../../contructors/useCaseConstructor';

export const guardErrors: OpenapiUseCaseSchemaConfigResponse[] = [
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
