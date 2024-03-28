import jwt, {DecodeOptions, SignOptions} from 'jsonwebtoken';
import {InternalError} from '../core/errors';
import {env} from './env';

export function jwtSign<T extends object = any>(payload: T, options?: SignOptions): string {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new InternalError('Invalid payload');
    if (!options) options = {};
    options.expiresIn = options?.expiresIn ?? 3600;
    return jwt.sign(payload, env.JWT_SECRET, options);
}

export function jwtDecode<T extends object = any>(token: string, options: DecodeOptions = {json: true}): T {
    if (!token || typeof token !== 'string') throw new InternalError('Invalid token');
    if (options.json === undefined) options.json = true;
    return jwt.decode(token, options) as T;
}
