import {NextFunction, Response} from 'express';
import {DecodedExpressRequest} from '../../../../../types/decodedExpressRequest';

export async function performanceMiddleware(_req: DecodedExpressRequest<null, null>, res: Response, next: NextFunction) {
    const t0 = performance.now();
    next();
    const t1 = performance.now();
    res.setHeader('X-Performance-MS', t1 - t0);
}
