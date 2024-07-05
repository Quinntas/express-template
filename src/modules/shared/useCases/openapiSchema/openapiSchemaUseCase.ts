import {Response} from 'express';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../core/types/decodedExpressRequest';
import {openapiSchema} from "../../../../infra/openapi/spec";

export async function openapiSchemaUseCase(_req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, openapiSchema);
}