import {OpenAPIV3} from "openapi-types";
import {userOpenAPiTagName} from "../../infra/openapi/userOpenAPiSpec";
import {internalServerErrorSchema} from "../../../../infra/openapi/internalServerError";
import {baseOpenAPIJsonResponse, openAPIJsonResponse} from "../../../../infra/openapi/jsonResponse";
import {guardErrorSchema} from "../../../../infra/openapi/guardError";

export const userLoginOpenAPISpec: OpenAPIV3.Document['paths'] = {
    '/user/login': {
        [OpenAPIV3.HttpMethods.POST]: {
            tags: [userOpenAPiTagName],
            description: "Login a user",
            summary: "Login a user",
            responses: {
                ...internalServerErrorSchema,
                ...guardErrorSchema,
                200: {
                    description: "Login was made successfully",
                    content: {
                        ...openAPIJsonResponse(
                            {
                                token: {
                                    type: 'string',
                                },
                                expiresIn: {
                                    type: 'number',
                                },
                                expireDate: {
                                    type: 'string'
                                }
                            }
                        )
                    }
                },
                404: {
                    description: "User was not found",
                    content: {
                        ...baseOpenAPIJsonResponse('User was not found')
                    }
                },
                401: {
                    description: "Invalid email or password",
                    content: {
                        ...baseOpenAPIJsonResponse('Invalid email or password')
                    }
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
                                type: 'string',
                            },
                        }
                    )
                }
            }
        }
    }
}