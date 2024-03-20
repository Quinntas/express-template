import {NextFunction, Request, Response, Router} from "express";
import {userRouter} from "../../modules/user/infra/http/userRouter";
import {get} from "../../core/handleRequest";
import {DecodedExpressRequest} from "../../types/decodedExpressRequest";
import {jsonResponse} from "../../core/responses";
import {userRateLimitMiddleware} from "../../modules/user/infra/middleware/rateLimit/userRateLimitMiddleware";

export const v1Router: Router = Router();

v1Router.use(
    (req: Request, res: Response, next: NextFunction) =>
        userRateLimitMiddleware(req as DecodedExpressRequest<null, null>, res, next)
)

get(v1Router, "/", async function healthCheck(_req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, {message: "ok"});
});

v1Router.use('/users', userRouter)