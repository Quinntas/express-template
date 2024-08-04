import {OpenapiUseCaseSchemaConfigResponse} from '../../../../../infra/openapi/contructors/useCaseConstructor';

export const internalServerErrorsOpenapi: OpenapiUseCaseSchemaConfigResponse[] =
    [
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
