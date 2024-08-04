import {OpenAPIV3} from 'openapi-types';
import {constructOpenapiUseCaseSchema} from '../../../../../infra/openapi/contructors/useCaseConstructor';
import {baseHttpErrorsOpenapi} from '../../../../shared/infra/openapi/errors/baseHttpErrors.openapi';
import {constructUserOpenapiPath, userOpenAPiTagName} from '../../infra/openapi/user.openapi';

export const userLoginOpenapi = constructOpenapiUseCaseSchema({
    path: constructUserOpenapiPath('/login'),
    patterns: [
        {
            method: OpenAPIV3.HttpMethods.POST,
            tags: [userOpenAPiTagName],
            description: 'Login a user',
            summary: 'Login a user',
            responses: [
                ...baseHttpErrorsOpenapi,
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
