import {NextFunction, Request, Response, Router} from 'express';
import {route} from '../../core/handleRequest';
import {jsonResponse} from '../../core/responses';
import {userRouter} from '../../modules/user/infra/http/userRouter';
import {userRateLimitMiddleware} from '../../modules/user/infra/middleware/rateLimit/userRateLimitMiddleware';
import {DecodedExpressRequest} from '../../types/decodedExpressRequest';

export const v1Router: Router = Router();

v1Router.use((req: Request, res: Response, next: NextFunction) => userRateLimitMiddleware(req as DecodedExpressRequest<null, null>, res, next));

route(v1Router, 'get', '/', async function healthCheck(_req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, {message: 'ok'});
});

v1Router.use('/users', userRouter);
