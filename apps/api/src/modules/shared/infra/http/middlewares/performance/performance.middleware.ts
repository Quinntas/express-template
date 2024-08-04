import {NextFunction, Response} from 'express';
import {Ok} from 'ts-results';
import {DecodedExpressRequest} from '../../../../../../lib/web/decodedExpressRequest';

export async function performanceMiddleware(_req: DecodedExpressRequest<null>, res: Response, next: NextFunction) {
    const t0 = performance.now();
    next();
    const t1 = performance.now();
    const formatted = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(t1 - t0);
    res.setHeader('X-Performance-MS', formatted);
    return Ok.EMPTY;
}
