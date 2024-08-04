import {NextFunction, Response} from 'express';
import {getClientIp} from 'request-ip';
import {Err, Ok} from 'ts-results';
import {cacheService} from '../../../../../../infra/connections/cache';
import {DecodedExpressRequest} from '../../../../../../lib/web/decodedExpressRequest';
import {HttpError} from '../../../../../../lib/web/errors';
import {
    maxRequestsPerMinute,
    redisRateLimitKeyPrefix,
} from './rateLimit.constants';

export async function rateLimitMiddleware(
    req: DecodedExpressRequest<null>,
    _res: Response,
    next: NextFunction,
) {
    const ip: string | null = getClientIp(req);

    if (!ip) return Err(new HttpError(401, 'Could not get client IP'));

    const key = `${redisRateLimitKeyPrefix}:${ip}`;

    const redisResult = await cacheService.get(key);

    if (!redisResult.ok) {
        await cacheService.set(key, 1, 60);
        return Ok(next());
    }

    const result = parseInt(redisResult.val);

    if (result >= maxRequestsPerMinute)
        return Err(new HttpError(429, 'Rate limit exceeded'));

    await cacheService.set(key, result + 1, 60);

    return Ok(next());
}
