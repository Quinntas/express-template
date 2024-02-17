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

function hasSchema(type: string) {
    return type === "object" || type === "array"
}

export function bodyParse(bodyObject: object, bodyParseObject: BodyParseObject) {
    const keys = Object.keys(bodyParseObject);
    for (let i = 0; i < keys.length; i++) {
        if (!bodyObject.hasOwnProperty(keys[i]))
            if (bodyParseObject[keys[i]].required)
                throw new HttpError(400, `Missing required field`, {field: keys[i]})
        switch (typeof bodyObject[keys[i]]) {
            case "object":
                if (bodyParseObject[keys[i]].type === "array" && Array.isArray(bodyObject[keys[i]])) {
                    if (bodyParseObject[keys[i]].type !== "array")
                        throw new HttpError(400, `Invalid type for field`, {
                            field: keys[i],
                            expected: bodyParseObject[keys[i]].type
                        })

                    for (let j = 0; j < bodyObject[keys[i]].length; j++) {
                        if (typeof bodyObject[keys[i]][j] === 'object')
                            // @ts-ignore
                            bodyParse(bodyObject[keys[i]][j], bodyParseObject[keys[i]].schema.schema)
                        // @ts-ignore
                        else if (typeof bodyObject[keys[i]][j] !== bodyParseObject[keys[i]].schema.type)
                            throw new HttpError(400, `Invalid type for field`, {
                                field: keys[i],
                                // @ts-ignore
                                expected: bodyParseObject[keys[i]].schema.type
                            })
                    }
                } else {
                    if (bodyParseObject[keys[i]].type !== "object")
                        throw new HttpError(400, `Invalid type for field`, {
                            field: keys[i],
                            // @ts-ignore
                            expected: bodyParseObject[keys[i]].schema.type
                        })

                    // @ts-ignore
                    bodyParse(bodyObject[keys[i]], bodyParseObject[keys[i]].schema)
                }
                break
            default:
                if (typeof bodyObject[keys[i]] !== bodyParseObject[keys[i]].type)
                    throw new HttpError(400, `Invalid type for field`, {
                        field: keys[i],
                        expected: bodyParseObject[keys[i]].type
                    })
                break
        }
    }
}
