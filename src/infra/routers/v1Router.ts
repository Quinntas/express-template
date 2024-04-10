import {NextFunction, Request, Response, Router} from 'express';
import {route} from '../../core/handleRequest';
import {healthCheckUseCase} from '../../modules/shared/useCases/healthCheck/healthCheckUseCase';
import {userRouter} from '../../modules/user/infra/http/userRouter';
import {userRateLimitMiddleware} from '../../modules/user/infra/middleware/rateLimit/userRateLimitMiddleware';
import {DecodedExpressRequest} from '../../types/decodedExpressRequest';
import {handleMiddleware} from "../../core/middleware";

export const v1Router: Router = Router();

v1Router.use((req: Request, res: Response, next: NextFunction) =>
    handleMiddleware<null, null>(req as DecodedExpressRequest<null, null>, res, next,userRateLimitMiddleware)
);

route(v1Router, 'get', '/', healthCheckUseCase);

v1Router.use('/users', userRouter);
