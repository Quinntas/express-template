import {OpenapiUseCaseSchemaConfigResponse} from '../../contructors/useCaseConstructor';

export const internalServerErrors: OpenapiUseCaseSchemaConfigResponse[] = [
    {
        code: 500,
        description: 'Internal server error',
        schema: {
            message: {
                type: 'string',
                example: 'Internal server error',
                default: 'Internal server error',
            },
        },
    },
];
