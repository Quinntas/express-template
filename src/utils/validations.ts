/**
 * Validates if an argument matches any of the values in the given enum object.
 *
 * @param {object} e - The enum object.
 * @param {any} argument - The argument to validate.
 *
 * @returns {boolean} - True if the argument matches any of the enum values, false otherwise.
 */
export function validateEnum(e: {[s: number]: string}, argument: any) {
    return Object.keys(e).some((key) => e[key as any] === argument);
}

/**
 * Validates if the given argument is a string.
 *
 * @param {any} argument - The argument to be validated.
 * @return {boolean} - Returns true if the argument is a string, otherwise false.
 */
export function validateString(argument: any): argument is string {
    return typeof argument === 'string';
}

/**
 * Validates if the given argument is a number.
 *
 * @param {any} argument - The argument to validate.
 * @return {boolean} Returns true if the argument is a number, otherwise false.
 */
export function validateNumber(argument: any): argument is number {
    return typeof argument === 'number';
}

/**
 * Checks whether the given argument is a boolean.
 *
 * @param {any} argument - The argument to validate.
 * @return {boolean} - Returns true if the argument is a boolean, false otherwise.
 */
export function validateBoolean(argument: any): argument is boolean {
    return typeof argument === 'boolean';
}

/**
 * Checks if the given argument is null or undefined.
 *
 * @param {any} argument - The argument to be checked.
 * @return {boolean} - Returns true if the argument is null or undefined, false otherwise.
 */
export function validateNullOrUndefined(argument: any): argument is null {
    return argument === null || argument === undefined;
}

/**
 * Checks if the given argument is a valid array.
 *
 * @param {any} argument - The argument to validate.
 * @return {boolean} Returns true if the argument is a valid array, otherwise false.
 */
export function validateArray(argument: any): argument is object {
    if (validateNullOrUndefined(argument)) return false;
    return Array.isArray(argument);
}

/**
 * Validates if the argument is an object.
 *
 * @param {any} argument - The argument to validate.
 * @return {boolean} - Returns true if the argument is an object, otherwise returns false.
 */
export function validateObject(argument: any): argument is object {
    if (validateNullOrUndefined(argument)) return false;
    if (typeof argument !== 'object') return false;
    return !validateArray(argument);
}
