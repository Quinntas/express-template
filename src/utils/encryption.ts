import {createHash, pbkdf2Sync, randomBytes, timingSafeEqual} from 'crypto';
import {InternalError} from '../core/errors';

function generateSalt(): string {
    return randomBytes(16).toString('hex');
}

export function parseEncryptedString(password: string) {
    const splitPass = password.split('$');
    return {
        salt: splitPass[1],
        iterations: parseInt(splitPass[0]),
        hash: splitPass[2],
    };
}

export function randomString(length: number, chars: string) {
    if (!chars) throw new InternalError("Argument 'chars' is undefined");

    const charsLength = chars.length;
    if (charsLength > 256) throw new InternalError("Argument 'chars' should not have more than 256 characters" + ', otherwise unpredictability will be broken');

    const bytes = randomBytes(length);
    let result = new Array(length);
    let cursor = 0;

    for (let i = 0; i < length; i++) {
        cursor += bytes[i];
        result[i] = chars[cursor % charsLength];
    }

    return result.join('');
}

export function createRandomString(length: number): string {
    return randomString(length, 'ABCDEFGHIJKLMNOPQTUVWXYZ0123456789');
}

export function compare(data: string, password: string): boolean {
    return timingSafeEqual(Buffer.from(data), Buffer.from(password));
}

export function hashString(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

export function encrypt(data: string, pepper: string, iterations: number = 10000, salt?: string): string {
    if (!data) throw new InternalError('Data must be defined');
    if (typeof data !== 'string') throw new InternalError('Data must be a string');
    if (!salt) salt = generateSalt();
    const result = pbkdf2Sync(pepper + data, salt, iterations, 64, 'sha512').toString('hex');
    return `${iterations}$${salt}$${result}`;
}
