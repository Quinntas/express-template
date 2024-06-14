import {OpenAPIV3} from "openapi-types";

export function openAPIJsonResponse(properties: OpenAPIV3.BaseSchemaObject['properties']): OpenAPIV3.ResponseObject['content'] {
    return {
        'application/json': {
            schema: {
                type: 'object',
                properties
            }
        }
    }
}

export function baseOpenAPIJsonResponse(defaultMsg: string | undefined = undefined) {
    return openAPIJsonResponse({
        message: {
            type: 'string',
            example: defaultMsg,
            default: defaultMsg
        }
    })
}