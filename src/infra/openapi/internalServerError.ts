import {OpenAPIV3} from "openapi-types";
import {baseOpenAPIJsonResponse} from "./jsonResponse";

export const internalServerErrorSchema: OpenAPIV3.ResponsesObject = {
    500: {
        description: "Internal server error",
        content: {
            ...baseOpenAPIJsonResponse('Internal server error')
        }
    }
}