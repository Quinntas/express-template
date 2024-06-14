import {NextFunction, Response} from 'express';
import {getClientIp} from 'request-ip';
import {HttpError} from '../../../../../../core/errors';
import {DecodedExpressRequest} from '../../../../../../core/types/decodedExpressRequest';
import {redisClient} from '../../../../../../infra/database/redis';
import {maxRequestsPerMinute, redisRateLimitKeyPrefix} from './constants';

export async function rateLimitMiddleware(req: DecodedExpressRequest<null, null>, _res: Response, next: NextFunction): Promise<void> {
    const ip: string | null = getClientIp(req);

    if (!ip) throw new HttpError(401, 'Could not get client IP');

    const key = `${redisRateLimitKeyPrefix}:${ip}`;

    const redisResult = await redisClient.get(key);

    if (!redisResult) {
        await redisClient.set(key, 1, 60);
        return next();
    }

    const result = parseInt(redisResult);

    if (result >= maxRequestsPerMinute) throw new HttpError(429, 'Rate limit exceeded');

    await redisClient.set(key, result + 1, 60);

    next();
}
