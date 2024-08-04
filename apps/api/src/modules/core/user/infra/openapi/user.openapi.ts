import {OpenAPIV3} from 'openapi-types';

export const userOpenAPiTagName = 'Users';

export function constructUserOpenapiPath(path: string) {
    return `/${userOpenAPiTagName.toLowerCase()}` + path;
}

export const userOpenAPiTagObject: OpenAPIV3.TagObject = {
    name: userOpenAPiTagName,
    description: 'User related endpoints',
};
