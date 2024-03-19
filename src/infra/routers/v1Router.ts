import {Response, Router} from "express";
import {userRouter} from "../../modules/user/infra/http/userRouter";
import {get} from "../../core/handleRequest";
import {DecodedExpressRequest} from "../../types/decodedExpressRequest";
import {jsonResponse} from "../../core/responses";

export const v1Router: Router = Router();

get(v1Router, "/", async function healthCheck(_req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, {message: "ok"});
});

v1Router.use('/users', userRouter)