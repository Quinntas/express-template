import {Response} from 'express';
import {readFile} from 'node:fs';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../core/types/decodedExpressRequest';

export async function openapiSchemaUseCase(_req: DecodedExpressRequest<null, null>, res: Response) {
    let openapiSchema: unknown | null = null;

    readFile('openapi.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            throw new HttpError(500, 'Error reading openapi.json file');
        }
        openapiSchema = JSON.parse(data);
    });

    if (!openapiSchema) throw new HttpError(500, 'Error reading openapi.json file');

    return jsonResponse(res, 200, openapiSchema);
}
