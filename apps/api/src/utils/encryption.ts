import {createHash, pbkdf2Sync, randomBytes, timingSafeEqual} from 'crypto';
import {Err, Ok} from 'ts-results';
import {InternalError} from '../lib/web/errors';

export namespace Encryption {
    export function parseEncryptedString(password: string) {
        const splitPass = password.split('$');
        if (splitPass.length !== 3)
            return Err(new InternalError('Invalid encrypted password format'));
        return Ok({
            iterations: parseInt(splitPass[1]),
            salt: splitPass[2],
            hash: splitPass[3],
        });
    }

    export function randString(length: number, chars: string) {
        if (!chars)
            return Err(new InternalError("Argument 'chars' is undefined"));

        const charsLength = chars.length;
        if (charsLength > 256)
            return Err(
                new InternalError(
                    "Argument 'chars' should not have more than 256 characters" +
                        ', otherwise unpredictability will be broken',
                ),
            );

        const bytes = randomBytes(length);
        const result = new Array(length);
        let cursor = 0;

        for (let i = 0; i < length; i++) {
            cursor += bytes[i];
            result[i] = chars[cursor % charsLength];
        }

        return Ok(result.join(''));
    }

    /**
     * Compare two strings in a timing-safe manner.
     *
     * @param {string} data - The first string to compare.
     * @param {string} password - The second string to compare.
     * @return {boolean} - Returns true if the two strings are equal, otherwise false.
     */
    export function compare(data: string, password: string): boolean {
        return timingSafeEqual(Buffer.from(data), Buffer.from(password));
    }

    export function hash(data: string, algorithm: string = 'sha265'): string {
        return createHash(algorithm).update(data).digest('hex');
    }

    export function encrypt(
        data: string,
        pepper: string,
        iterations: number = 10000,
        salt?: string,
    ): string {
        if (!salt) salt = randomBytes(16).toString('hex');
        const result = pbkdf2Sync(
            pepper + data,
            salt,
            iterations,
            64,
            'sha512',
        ).toString('hex');
        return `sha512$${iterations}$${salt}$${result}`;
    }
}
