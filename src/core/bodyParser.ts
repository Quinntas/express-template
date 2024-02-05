import {HttpError} from "./errors";

export type BodyParseObject = {
    [key: string]: {
        type: 'string' | 'number' | 'boolean';
        required: boolean;
    } | {
        type: 'object'
        required: boolean;
        schema: BodyParseObject;
    } | {
        type: 'array'
        required: boolean;
        schema: {
            type: 'string' | 'number' | 'boolean';
        }
    } | {
        type: 'array'
        required: boolean;
        schema: {
            type: 'object';
            schema: BodyParseObject;
        }
    };
}

export function bodyParse(bodyObject: object, bodyParseObject: BodyParseObject) {
    const keys = Object.keys(bodyParseObject);
    for (let i = 0; i < keys.length; i++) {
        if (!bodyObject[keys[i]])
            if (bodyParseObject[keys[i]].required)
                throw new HttpError(400, `Missing required field`, {field: keys[i]})
        if (typeof bodyObject[keys[i]] !== bodyParseObject[keys[i]].type || bodyParseObject[keys[i]].type === "array") {
            if (bodyParseObject[keys[i]].type === "array" && Array.isArray(bodyObject[keys[i]]))
                continue
            throw new HttpError(400, `Invalid type for field`, {
                field: keys[i],
                expected: bodyParseObject[keys[i]].type
            })
        }
        if (bodyParseObject[keys[i]].type === "object")
            // @ts-ignore
            // TODO: Fix this
            bodyParse(bodyObject[keys[i]], bodyParseObject[keys[i]].schema)
    }
}