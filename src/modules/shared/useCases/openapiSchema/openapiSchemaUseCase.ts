import {existsSync, readFileSync} from 'node:fs';
import {Err, Ok, Result} from 'ts-results';
import {HttpResponse} from '../../../../core/responses';
import {UnknownObject} from '../../../../core/types/json';
import {errorParsingFile, errorReadingFile} from './openapiSchemaErrors';

function readFile(path: string): Result<string, 'Invalid path'> {
    if (existsSync(path)) return Ok(readFileSync(path).toString());
    return Err('Invalid path');
}

export async function openapiSchemaUseCase() {
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
