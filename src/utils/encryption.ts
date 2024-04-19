import {createHash, pbkdf2Sync, randomBytes, timingSafeEqual} from 'crypto';
import {InternalError} from '../core/errors';

/**
 * Generates a random salt.
 *
 * @returns {string} - The generated salt.
 */
function generateSalt(): string {
    return randomBytes(16).toString('hex');
}

/**
 * Parses an encrypted string and returns the extracted components.
 *
 * @param {string} password - The encrypted string.
 * @returns {Object} - An object containing the extracted components.
 * @property {string} salt - The salt value extracted from the password.
 * @property {number} iterations - The number of iterations extracted from the password.
 * @property {string} hash - The hash value extracted from the password.
 */
export function parseEncryptedString(password: string) {
    const splitPass = password.split('$');
    return {
        salt: splitPass[1],
        iterations: parseInt(splitPass[0]),
        hash: splitPass[2],
    };
}

/**
 * Generates a random string.
 *
 * @param {number} length - The length of the random string to generate.
 * @param {string} chars - The characters to use for generating the random string.
 * @throws {InternalError} If the 'chars' argument is undefined or if it has more than 256 characters.
 * @returns {string} The randomly generated string.
 */
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

/**
 * Generates a random string of the specified length.
 *
 * @param {number} length - The length of the random string to generate.
 * @return {string} A random string of the specified length.
 */
export function createRandomString(length: number): string {
    return randomString(length, 'ABCDEFGHIJKLMNOPQTUVWXYZ0123456789');
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

/**
 * Generates the hash value of the given string using SHA-256 algorithm.
 *
 * @param {string} data - The string to be hashed.
 * @return {string} The hashed value of the input string.
 */
export function hashString(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

/**
 * Encrypts the given data using a pepper and optional salt.
 *
 * @param {string} data - The data to be encrypted.
 * @param {string} pepper - The pepper to be prepended to the data before encryption.
 * @param {number} [iterations=10000] - The number of iterations for the encryption. Defaults to 10000.
 * @param {string} [salt] - The salt to be used for the encryption. If not provided, a random salt will be generated.
 * @throws {InternalError} If the data is not defined or is not a string.
 * @returns {string} The encrypted data in the format 'iterations$salt$result', where 'iterations' is the number of iterations, 'salt' is the used salt, and 'result' is the resulting encrypted data.
 */
export function encrypt(data: string, pepper: string, iterations: number = 10000, salt?: string): string {
    if (!data) throw new InternalError('Data must be defined');
    if (typeof data !== 'string') throw new InternalError('Data must be a string');
    if (!salt) salt = generateSalt();
    const result = pbkdf2Sync(pepper + data, salt, iterations, 64, 'sha512').toString('hex');
    return `${iterations}$${salt}$${result}`;
}
