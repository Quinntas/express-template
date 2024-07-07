import {OpenAPIV3} from 'openapi-types';
import {constructOpenapiUseCaseSchema} from '../../../../infra/openapi/contructors/useCaseConstructor';
import {openapiAppServiceHttpErrorResponses} from '../../../../infra/openapi/defaults/errors/openapiAppServiceHttpErrorResponses';
import {constructUserOpenapiPath, userOpenAPiTagName} from '../../infra/openapi/userOpenapiSchema';

export const userCreateOpenAPISpec = constructOpenapiUseCaseSchema({
    path: constructUserOpenapiPath('/create'),
    patterns: [
        {
            method: OpenAPIV3.HttpMethods.POST,
            tags: [userOpenAPiTagName],
            description: 'Creates a user',
            summary: 'Creates a user',
            responses: [
                ...openapiAppServiceHttpErrorResponses,
                {
                    code: 200,
                    description: 'User was created successfully',
                    schema: {
                        message: {
                            type: 'string',
                            example: 'User was created successfully',
                            default: 'User was created successfully',
                        },
                    },
                },
                {
                    code: 409,
                    description: 'Email already registered',
                    schema: {
                        message: {
                            type: 'string',
                            example: 'Email already registered',
                            default: 'Email already registered',
                        },
                    },
                },
            ],
            requestBody: {
                schema: {
                    email: {
                        type: 'string',
                    },
                    password: {
                        type: 'string',
                    },
                },
            },
        },
    ],
});
