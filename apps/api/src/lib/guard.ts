import {Err, Ok} from 'ts-results';
import {ArrayUtils} from 'typescript-utils/src/namespaces/arrayUtils';
import {BooleanUtils} from 'typescript-utils/src/namespaces/booleanUtils';
import {EnumUtils} from 'typescript-utils/src/namespaces/enumUtils';
import {NumberUtils} from 'typescript-utils/src/namespaces/numberUtils';
import {ObjectUtils} from 'typescript-utils/src/namespaces/objectUtils';
import {StringUtils} from 'typescript-utils/src/namespaces/stringUtils';
import {isNullOrUndefined} from 'typescript-utils/src/validators';
import {GuardError} from './errors';

export function againstNotString(key: string, argument: any) {
    if (!StringUtils.isString(argument)) return Err(new GuardError('The argument is not a string', key));
    return Ok<string>(argument);
}

export function againstNotBetween<T>(key: string, argument: T, min: number, max: number) {
    let length: number;

    switch (typeof argument) {
        case 'string':
            length = argument.length;
            break;
        case 'number':
            length = argument;
            break;
        default:
            return Err(new GuardError('The argument is not a string, number', key));
    }

    if (length < min || length > max) return Err(new GuardError(`The argument is not between ${min} and ${max}`, key));

    return Ok<T>(argument);
}

export function againstNotNumber(key: string, argument: any) {
    if (!NumberUtils.isNumber(argument)) return Err(new GuardError('The argument is not a number', key));
    return Ok<number>(argument);
}

export function againstNotBoolean(key: string, argument: any) {
    if (!BooleanUtils.isBoolean(argument)) return Err(new GuardError('The argument is not a boolean', key));
    return Ok<boolean>(argument);
}

export function againstNotArray<T extends Array<any>>(key: string, argument: T) {
    if (!ArrayUtils.isArray(argument)) return Err(new GuardError('The argument is not an array', key));
    return Ok<T>(argument);
}

export function againstNotObject<T extends object>(key: string, argument: T) {
    if (!ObjectUtils.isObject(argument)) return Err(new GuardError('The argument is not an object', key));
    return Ok<T>(argument);
}

export function againstNullOrUndefined<T>(key: string, argument: T) {
    if (isNullOrUndefined(argument)) return Err(new GuardError('The argument is null or undefined', key));
    return Ok<T>(argument);
}

export function againstBadFormat(key: string, argument: string, regex: RegExp) {
    if (!regex.test(argument)) return Err(new GuardError('The argument has a bad format', key));
    return Ok<string>(argument);
}

export function againstBadEnumValue(key: string, enumObject: {[s: number]: string}, argument: any) {
    if (!EnumUtils.inEnum(enumObject, argument)) return Err(new GuardError('The argument is not part of the enum', key));
    return Ok(argument);
}
