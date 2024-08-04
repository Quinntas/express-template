import {existsSync, readFileSync} from 'node:fs';
import {Err, Ok, Result} from 'ts-results';
import {HttpResponse} from '../../../../lib/responses';
import {UnknownObject} from '../../../../lib/types/json';
import {errorParsingFile, errorReadingFile} from './openapiSchema.errors';

function readFile(path: string): Result<string, 'Invalid path'> {
    if (existsSync(path)) return Ok(readFileSync(path).toString());
    return Err('Invalid path');
}

export async function openapiSchemaUsecase() {
    const result = readFile('openapi.json');

    if (!result.ok) return Err(errorReadingFile);

    let openapiSchema: UnknownObject;
    try {
        openapiSchema = JSON.parse(result.unwrap()) as UnknownObject;
    } catch (error) {
        return Err(errorParsingFile);
    }

    return Ok<HttpResponse<typeof openapiSchema>>({
        data: openapiSchema,
    });
}
