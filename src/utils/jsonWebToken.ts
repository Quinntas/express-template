import jwt, {DecodeOptions, SignOptions} from 'jsonwebtoken';
import {InternalError} from '../core/errors';
import {env} from './env';

/**
 * Signs a JSON Web Token (JWT) with the given payload and options.
 *
 * @template T - The payload type.
 * @param {T} payload - The payload object to be encoded in the JWT.
 * @param {SignOptions} [options] - The options for signing the JWT.
 * @throws {InternalError} If the payload is invalid.
 * @returns {string} The signed JWT.
 */
export function jwtSign<T extends object = any>(payload: T, options?: SignOptions): string {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new InternalError('Invalid payload');
    if (!options) options = {};
    options.expiresIn = options?.expiresIn ?? 3600;
    return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Decodes a JSON Web Token (JWT).
 *
 * @param {string} token - The JWT to decode.
 * @param {DecodeOptions} [options={json: true}] - The options for decoding the JWT.
 * @return {T} - The decoded JWT payload.
 * @throws {InternalError} - If the token parameter is invalid or empty.
 */
export function jwtDecode<T extends object = any>(token: string, options: DecodeOptions = {json: true}): T {
    if (!token || typeof token !== 'string') throw new InternalError('Invalid token');
    if (options.json === undefined) options.json = true;
    return jwt.decode(token, options) as T;
}
