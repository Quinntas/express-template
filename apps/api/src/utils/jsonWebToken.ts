import jwt, {DecodeOptions, SignOptions} from 'jsonwebtoken';
import {env} from '../common/env';

export namespace JWT {
    export function sign<T extends object>(payload: T, options: SignOptions = {}): string {
        options.expiresIn = options?.expiresIn ?? 3600;
        return jwt.sign(payload, env.JWT_SECRET, options);
    }

    export function decode<T extends object>(token: string, options: DecodeOptions = {json: true}): T {
        if (options.json === undefined) options.json = true;
        return jwt.decode(token, options) as T;
    }
}
