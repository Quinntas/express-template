import {OpenAPIV3} from 'openapi-types';
import {baseOpenAPIJsonResponse, openAPIJsonResponse} from '../../../../infra/openapi/jsonResponse';
import {userOpenAPIPathSpec, userOpenAPiTagName} from '../../infra/openapi/userOpenAPiSpec';
import {baseHttpErrors} from "../../../../infra/openapi/baseHttpErrors";

export const userLoginOpenAPISpec: OpenAPIV3.Document['paths'] = {
    [userOpenAPIPathSpec('/login')]: {
        [OpenAPIV3.HttpMethods.POST]: {
            tags: [userOpenAPiTagName],
            description: 'Login a user',
            summary: 'Login a user',
            responses: {
                ...baseHttpErrors,
                200: {
                    description: 'Login was made successfully',
                    content: {
                        ...openAPIJsonResponse({
                            token: {
                                type: 'string',
                            },
                            expiresIn: {
                                type: 'number',
                            },
                            expireDate: {
                                type: 'string',
                            },
                        }),
                    },
                },
                404: {
                    description: 'User was not found',
                    content: {
                        ...baseOpenAPIJsonResponse('User was not found'),
                    },
                },
                401: {
                    description: 'Invalid email or password',
                    content: {
                        ...baseOpenAPIJsonResponse('Invalid email or password'),
                    },
                },
            },
            requestBody: {
                required: true,
                content: {
                    ...openAPIJsonResponse({
                        email: {
                            type: 'string',
                        },
                        password: {
                            type: 'string',
                        },
                    }),
                },
            },
        },
    },
};
