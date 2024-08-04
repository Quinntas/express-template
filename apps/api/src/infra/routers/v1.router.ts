import {NextFunction, Request, Response, Router} from 'express';
import {get} from '../../lib/handler';
import {middlewareHandler} from '../../lib/middleware';
import {userRouter} from '../../modules/core/user/infra/http/user.router';
import {performanceMiddleware} from '../../modules/shared/infra/http/middlewares/performance/performance.middleware';
import {rateLimitMiddleware} from '../../modules/shared/infra/http/middlewares/rateLimit/rateLimit.middleware';
import {healthCheckUsecase} from '../../modules/shared/useCases/healthCheck/healthCheck.usecase';
import {openapiSchemaUsecase} from '../../modules/shared/useCases/openapiSchema/openapiSchema.usecase';

export const v1Router: Router = Router();

v1Router.use((req: Request, res: Response, next: NextFunction) => middlewareHandler(req, res, next, performanceMiddleware));
v1Router.use((req: Request, res: Response, next: NextFunction) => middlewareHandler(req, res, next, rateLimitMiddleware));

get(v1Router, '/', healthCheckUsecase);
get(v1Router, '/openapi', openapiSchemaUsecase);

v1Router.use('/users', userRouter);
