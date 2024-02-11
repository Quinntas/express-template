import {HttpError} from "./errors";
import {Result, SpectreError} from "spectre-orm";

export function handleError(error: Error) {
    if (error instanceof HttpError) {
        throw new Error(error.message)
    } else if (error instanceof Result) {
        switch (error.errorType) {
            case SpectreError.DATABASE_DUPLICATE_ENTRY:
                throw new Error(error.message)
            case SpectreError.DATABASE_WRONG_VALUE:
            case SpectreError.DATABASE_BAD_REQUEST:
            case SpectreError.DATABASE_INTERNAL_ERROR:
                throw new Error(error.message)
        }
    }

    console.log(error)

    throw new Error(error.message)
}

export async function handleResolver<iBody>(parent: any, args: iBody, context: any, handler: Function) {
    console.log('args', args)
    console.log('context', context)
    console.log('parent', parent)

    try {
        return await handler(parent, args, context);
    } catch (error) {
        return handleError(error);
    }
}
