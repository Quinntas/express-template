import {validateEnum} from '../utils/validations';
import {GuardError} from './errors';

export function againstNullOrUndefinedBulk(args: [string, any][]) {
    args.forEach((arg) => againstNullOrUndefined(arg[0], arg[1]));
}

export function againstNotString(key: string, argument: any): argument is string {
    if (typeof argument !== 'string') throw new GuardError('The argument is not a string', key);
    return true;
}

export function againstNotNumber(key: string, argument: any): argument is number {
    if (typeof argument !== 'number') throw new GuardError('The argument is not a number', key);
    return true;
}

export function againstNotBoolean(key: string, argument: any): argument is boolean {
    if (typeof argument !== 'boolean') throw new GuardError('The argument is not a boolean', key);
    return true;
}

export function againstNotArray<T extends object = any>(key: string, argument: T): argument is T {
    if (!Array.isArray(argument)) throw new GuardError('The argument is not an array', key);
    return true;
}

export function againstNotObject<T extends object = any>(key: string, argument: T): argument is T {
    if (argument == null || Array.isArray(argument) || typeof argument !== 'object') throw new GuardError('The argument is not an object', key);
    return true;
}

export function againstNullOrUndefined(key: string, argument: any) {
    if (argument === null || argument === undefined) throw new GuardError('The argument is null or undefined', key);
}

export function againstAtMost(key: string, argument: number, max: number) {
    if (argument > max) throw new GuardError(`The argument is greater than ${max}`, key);
}

export function againstAtLeast(key: string, argument: number, min: number) {
    if (argument < min) throw new GuardError(`The argument is less than ${min}`, key);
}

export function againstAtLeastOneElement(key: string, argument: any[]) {
    if (argument.length === 0) throw new GuardError('The argument is empty', key);
}

export function againstBadFormat(key: string, argument: string, regex: RegExp) {
    if (!regex.test(argument)) throw new GuardError('The argument has a bad format', key);
}

export function againstBadEnumValue(key: string, e: {[s: number]: string}, argument: any) {
    if (!validateEnum(e, argument)) throw new GuardError('The argument is not part of the enum', key);
}
