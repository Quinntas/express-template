import {validateArray, validateBoolean, validateEnum, validateNullOrUndefined, validateNumber, validateObject, validateString} from '../utils/validations';
import {GuardError} from './errors';

/**
 * Checks if the argument is a string.
 * @param {string} key - The key or name of the argument.
 * @param {*} argument - The argument to be checked.
 * @return {boolean} - Returns true if the argument is a string, otherwise throws an error.
 * @throws {GuardError} - Throws an error if the argument is not a string.
 */
export function againstNotString(key: string, argument: any): argument is string {
    if (!validateString(argument)) throw new GuardError('The argument is not a string', key);
    return true;
}

/**
 * Checks whether the argument is a number or not.
 *
 * @param {string} key - The name of the key being validated.
 * @param {*} argument - The argument being checked.
 *
 * @throws {GuardError} - Throws an error if the argument is not a number.
 *
 * @return {boolean} - Returns true if the argument is a number.
 */
export function againstNotNumber(key: string, argument: any): argument is number {
    if (!validateNumber(argument)) throw new GuardError('The argument is not a number', key);
    return true;
}

/**
 * Checks if the given argument is a boolean value.
 *
 * @param {string} key - The key associated with the argument.
 * @param {*} argument - The argument to be checked.
 * @return {boolean} - Returns true if the argument is a boolean value, otherwise throws a GuardError.
 * @throws {GuardError} - Throws an error if the argument is not a boolean value.
 */
export function againstNotBoolean(key: string, argument: any): argument is boolean {
    if (!validateBoolean(argument)) throw new GuardError('The argument is not a boolean', key);
    return true;
}

/**
 * Checks if the provided argument is an array.
 *
 * @param {string} key - The key used for identification.
 * @param {T} argument - The argument to be checked.
 * @returns {boolean} - Returns true if the argument is an array, otherwise throws a GuardError.
 */
export function againstNotArray<T extends object = any>(key: string, argument: T): argument is T {
    if (!validateArray(argument)) throw new GuardError('The argument is not an array', key);
    return true;
}

/**
 * Checks if the given argument is an object.
 *
 * @param {string} key - The key associated with the argument being checked.
 * @param {T} argument - The argument to be checked against being a non-object.
 * @returns {boolean} - Returns true if the argument is an object; otherwise, throws a GuardError.
 * @throws {GuardError} - Throws a GuardError if the argument is not an object.
 */
export function againstNotObject<T extends object = any>(key: string, argument: T): argument is T {
    if (!validateObject(argument)) throw new GuardError('The argument is not an object', key);
    return true;
}

/**
 * Throws a `GuardError` if the provided argument is null or undefined.
 * @param {string} key - The key associated with the argument.
 * @param {*} argument - The argument to validate against null or undefined.
 * @throws {GuardError} - Thrown if the argument is null or undefined.
 */
export function againstNullOrUndefined(key: string, argument: any) {
    if (validateNullOrUndefined(argument)) throw new GuardError('The argument is null or undefined', key);
}

/**
 * Checks if the given argument is greater than the maximum value.
 *
 * @param {string} key - The key associated with the argument.
 * @param {number} argument - The argument to compare against the maximum value.
 * @param {number} max - The maximum value to compare against.
 *
 * @throws {GuardError} If the argument is greater than the maximum value.
 */
export function againstAtMost(key: string, argument: number, max: number) {
    if (argument > max) throw new GuardError(`The argument is greater than ${max}`, key);
}

/**
 * Checks if the given argument is less than the minimum value.
 *
 * @param {string} key - The key associated with the argument.
 * @param {number} argument - The argument to be checked.
 * @param {number} min - The minimum value allowed for the argument.
 * @throws {GuardError} - If the argument is less than the minimum value.
 */
export function againstAtLeast(key: string, argument: number, min: number) {
    if (argument < min) throw new GuardError(`The argument is less than ${min}`, key);
}

/**
 * Checks if the provided array has at least one element.
 * Throws an error if the array is empty.
 *
 * @param {string} key - The key or identifier associated with the argument.
 * @param {Array} argument - The array to be checked.
 *
 * @throws {GuardError} The argument is empty.
 */
export function againstAtLeastOneElement(key: string, argument: any[]) {
    if (argument.length === 0) throw new GuardError('The argument is empty', key);
}

/**
 * Checks if the given argument matches the provided regular expression pattern, and throws a GuardError if it doesn't.
 *
 * @param {string} key - The identifier of the method or value being checked.
 * @param {string} argument - The argument to be checked against the regular expression pattern.
 * @param {RegExp} regex - The regular expression pattern to match against the argument.
 * @throws {GuardError} Thrown if the argument does not match the regular expression pattern.
 */
export function againstBadFormat(key: string, argument: string, regex: RegExp) {
    if (!regex.test(argument)) throw new GuardError('The argument has a bad format', key);
}

/**
 * Validates if the provided argument is a valid value in the given enum.
 *
 * @param {string} key - The key associated with the enum value being checked.
 * @param {object} e - The enum containing the valid values to be checked against.
 * @param {any} argument - The argument to be checked against the enum.
 *
 * @throws {GuardError} - Throws an error if the argument is not a valid value in the enum.
 */
export function againstBadEnumValue(key: string, e: {[s: number]: string}, argument: any) {
    if (!validateEnum(e, argument)) throw new GuardError('The argument is not part of the enum', key);
}
