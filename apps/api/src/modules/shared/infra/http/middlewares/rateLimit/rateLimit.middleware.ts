import {NextFunction, Response} from 'express';
import {getClientIp} from 'request-ip';
import {Err, Ok} from 'ts-results';
import {redisClient} from '../../../../../../infra/connections/redis';
import {HttpError} from '../../../../../../lib/errors';
import {DecodedExpressRequest} from '../../../../../../lib/types/decodedExpressRequest';
import {maxRequestsPerMinute, redisRateLimitKeyPrefix} from './rateLimit.constants';

export async function rateLimitMiddleware(req: DecodedExpressRequest<null>, _res: Response, next: NextFunction) {
    const ip: string | null = getClientIp(req);

    if (!ip) return Err(new HttpError(401, 'Could not get client IP'));

    const key = `${redisRateLimitKeyPrefix}:${ip}`;

    const redisResult = await redisClient.get(key);

    if (!redisResult.ok) {
        await redisClient.set(key, 1, 60);
        return Ok(next());
    }

    const result = parseInt(redisResult.val);

    if (result >= maxRequestsPerMinute) return Err(new HttpError(429, 'Rate limit exceeded'));

    await redisClient.set(key, result + 1, 60);

    return Ok(next());
}
