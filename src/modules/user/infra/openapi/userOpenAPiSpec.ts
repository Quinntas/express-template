import {OpenAPIV3} from 'openapi-types';

export const userOpenAPiTagName = 'User';

export function userOpenAPIPathSpec(path: string) {
    return '/user' + path;
}

export const userOpenAPiTagSpec: OpenAPIV3.TagObject = {
    name: userOpenAPiTagName,
    description: 'User related endpoints',
};
