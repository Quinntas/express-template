import {OpenAPIV3} from "openapi-types";
import {userOpenAPiTagName} from "../../infra/openapi/userOpenAPiSpec";
import {internalServerErrorSchema} from "../../../../infra/openapi/internalServerError";
import {baseOpenAPIJsonResponse, openAPIJsonResponse} from "../../../../infra/openapi/jsonResponse";
import {guardErrorSchema} from "../../../../infra/openapi/guardError";

export const userCreatedOpenAPISpec: OpenAPIV3.Document['paths'] = {
    '/user/create': {
        [OpenAPIV3.HttpMethods.POST]: {
            tags: [userOpenAPiTagName],
            description: "Creates a user",
            summary: "Creates a user",
            responses: {
                ...internalServerErrorSchema,
                ...guardErrorSchema,
                200: {
                    description: "User was created successfully",
                    content: {
                        ...baseOpenAPIJsonResponse('User was created successfully')
                    }
                }
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