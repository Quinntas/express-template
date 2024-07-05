import {OpenAPIV3} from "openapi-types";
import * as fs from "node:fs";
import {userOpenAPiTagSpec} from "../../modules/user/infra/openapi/userOpenAPiSpec";
import {userEndpointsOpenapiSpec} from "../../modules/user/infra/openapi/userEndpointsOpenapiSpec";

export const openapiSchema: OpenAPIV3.Document = {
    info: {
        title: 'Express template ',
        description: 'This is the API documentation for the Express template project.',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Production server',
        },
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Development server',
        },
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Staging server',
        },
    ],
    openapi: '3.0.0',
    tags: [
        userOpenAPiTagSpec,
    ],
    paths: {
        ...userEndpointsOpenapiSpec
    }
}

fs.createWriteStream('openapi.json').write(JSON.stringify(openapiSchema, null, 2));