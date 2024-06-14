import {OpenAPIV3} from "openapi-types";
import {openAPIJsonResponse} from "./jsonResponse";

export const guardErrorSchema: OpenAPIV3.ResponsesObject = {
    422: {
        description: "Guard error",
        content: {
            ...openAPIJsonResponse({
                key: {
                    type: 'string',
                    example: 'email'
                },
                message: {
                    type: 'string',
                    example: 'Email is required'
                }
            })
        }
    }
}