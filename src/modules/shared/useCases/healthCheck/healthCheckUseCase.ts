import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {jsonResponse} from "../../../../core/responses";

export async function healthCheckUseCase(_req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, {message: 'ok'});
}