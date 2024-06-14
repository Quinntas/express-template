import {OpenAPIV3} from "openapi-types";
import {userCreatedOpenAPISpec} from "../../modules/user/useCases/userCreate/userCreatedOpenAPISpec";
import * as fs from "node:fs";
import {userOpenAPiTagSpec} from "../../modules/user/infra/openapi/userOpenAPiSpec";
import {userLoginOpenAPISpec} from "../../modules/user/useCases/userLogin/userLoginOpenAPISpec";

export const OpenAPISpec: OpenAPIV3.Document = {
    info: {
        title: 'RevPay API',
        description: 'This is the API documentation for the RevPay service',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'https://services.revpay.com.br/api/v1/',
            description: 'Production server',
        },
        {
            url: 'https://service-develop.revpay.com.br/api/v1/',
            description: 'Development server',
        },
        {
            url: 'https://service-staging.revpay.com.br/api/v1/',
            description: 'Staging server',
        },
    ],
    openapi: '3.0.0',
    tags: [
        userOpenAPiTagSpec,
    ],
    paths: {
        ...userCreatedOpenAPISpec,
        ...userLoginOpenAPISpec
    }
}

fs.createWriteStream('openapi.json').write(JSON.stringify(OpenAPISpec, null, 2));