import {OpenAPIV3} from 'openapi-types';
import {constructOpenapiUseCaseSchema} from '../../../../infra/openapi/contructors/useCaseConstructor';
import {openapiAppServiceHttpErrorResponses} from '../../../../infra/openapi/defaults/errors/openapiAppServiceHttpErrorResponses';
import {constructUserOpenapiPath, userOpenAPiTagName} from '../../infra/openapi/userOpenapiSchema';

export const userLoginOpenAPISpec = constructOpenapiUseCaseSchema({
    path: constructUserOpenapiPath('/login'),
    patterns: [
        {
            method: OpenAPIV3.HttpMethods.POST,
            tags: [userOpenAPiTagName],
            description: 'Login a user',
            summary: 'Login a user',
            responses: [
                ...openapiAppServiceHttpErrorResponses,
                {
                    code: 200,
                    description: 'Login was made successfully',
                    schema: {
                        token: {
                            type: 'string',
                        },
                        expiresIn: {
                            type: 'number',
                        },
                        expireDate: {
                            type: 'string',
                        },
                    },
                },
                {
                    code: 401,
                    description: 'Invalid email or password',
                    schema: {
                        message: {
                            type: 'string',
                            example: 'Invalid email or password',
                            default: 'Invalid email or password',
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
