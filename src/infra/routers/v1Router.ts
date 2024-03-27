import {NextFunction, Request, Response, Router} from 'express';
import {route} from '../../core/handleRequest';
import {userRouter} from '../../modules/user/infra/http/userRouter';
import {userRateLimitMiddleware} from '../../modules/user/infra/middleware/rateLimit/userRateLimitMiddleware';
import {DecodedExpressRequest} from '../../types/decodedExpressRequest';
import {healthCheckUseCase} from "../../modules/shared/useCases/healthCheck/healthCheckUseCase";

export const v1Router: Router = Router();

v1Router.use((req: Request, res: Response, next: NextFunction) => userRateLimitMiddleware(req as DecodedExpressRequest<null, null>, res, next));

route(v1Router, 'get', '/', healthCheckUseCase);

v1Router.use('/users', userRouter);
