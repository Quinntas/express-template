import {OpenAPIV3} from 'openapi-types';
import {userEndpointsOpenapiSpec} from '../../modules/user/infra/openapi/userEndpointsOpenapiSpec';
import {userOpenAPiTagObject} from '../../modules/user/infra/openapi/userOpenapiSchema';

export const openapiAppSchema: OpenAPIV3.Document = {
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
    tags: [userOpenAPiTagObject],
    paths: {
        ...userEndpointsOpenapiSpec,
    },
};
