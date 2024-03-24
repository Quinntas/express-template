import jwt, {DecodeOptions, SignOptions} from 'jsonwebtoken';
import {InternalError} from '../core/errors';

export function jwtSign<T extends object = any>(payload: T, secret: string, options?: SignOptions): string {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new InternalError('Invalid payload');
    if (!secret || typeof secret !== 'string') throw new InternalError('Invalid secret');
    if (!options) options = {};
    options.expiresIn = options?.expiresIn ?? 3600;
    return jwt.sign(payload, secret, options);
}

export function jwtDecode<T extends object = any>(token: string, options: DecodeOptions = {json: true}): T {
    if (!token || typeof token !== 'string') throw new InternalError('Invalid token');
    if (options.json === undefined) options.json = true;
    return jwt.decode(token, options) as T;
}
