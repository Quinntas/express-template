import {NextFunction, Request, Response, Router} from 'express';
import {get} from '../../core/handler';
import {handleMiddleware} from '../../core/middleware';
import {DecodedExpressRequest} from '../../core/types/decodedExpressRequest';
import {performanceMiddleware} from '../../modules/shared/infra/http/middlewares/performanceMiddleware';
import {rateLimitMiddleware} from '../../modules/shared/infra/http/middlewares/rateLimit/rateLimitMiddleware';
import {healthCheckUseCase} from '../../modules/shared/useCases/healthCheck/healthCheckUseCase';
import {userRouter} from '../../modules/user/infra/http/routers/userRouter';
import {openapiSchemaUseCase} from "../../modules/shared/useCases/openapiSchema/openapiSchemaUseCase";

export const v1Router: Router = Router();

v1Router.use((req: Request, res: Response, next: NextFunction) =>
    handleMiddleware<null, null>(req as DecodedExpressRequest<null, null>, res, next, performanceMiddleware),
);

v1Router.use((req: Request, res: Response, next: NextFunction) =>
    handleMiddleware<null, null>(req as DecodedExpressRequest<null, null>, res, next, rateLimitMiddleware),
);

get(v1Router, '/', healthCheckUseCase);
get(v1Router, '/openapi', openapiSchemaUseCase);

v1Router.use('/users', userRouter);
