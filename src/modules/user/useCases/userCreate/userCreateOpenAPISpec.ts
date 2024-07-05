import {OpenAPIV3} from "openapi-types";
import {userOpenAPIPathSpec, userOpenAPiTagName} from "../../infra/openapi/userOpenAPiSpec";
import {internalServerErrors} from "../../../../infra/openapi/internalServerErrors";
import {baseOpenAPIJsonResponse, openAPIJsonResponse} from "../../../../infra/openapi/jsonResponse";
import {guardErrors} from "../../../../infra/openapi/guardErrors";
import {rateLimitErrors} from "../../../../infra/openapi/rateLimitErrors";

export const userCreateOpenAPISpec: OpenAPIV3.Document['paths'] = {
    [userOpenAPIPathSpec('/create')]: {
        [OpenAPIV3.HttpMethods.POST]: {
            tags: [userOpenAPiTagName],
            description: "Creates a user",
            summary: "Creates a user",
            responses: {
                ...internalServerErrors,
                ...guardErrors,
                ...rateLimitErrors,
                200: {
                    description: "User was created successfully",
                    content: {
                        ...baseOpenAPIJsonResponse('User was created successfully')
                    }
                },
                409: {
                    description: 'Email already registered',
                    content: {
                        ...baseOpenAPIJsonResponse("Email already registered"),
                    },
                },
            },
            requestBody: {
                required: true,
                content: {
                    ...openAPIJsonResponse(
                        {
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string'
                            }
                        }
                    )
                }
            }
        }
    }
}