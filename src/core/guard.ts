import {GuardError} from "./errors";

export function againstNullOrUndefined(key: string, argument: any) {
    if (argument === null || argument === undefined)
        throw new GuardError("The argument is null or undefined", key);
}

export function againstAtMost(key: string, argument: number, max: number) {
    if (argument > max)
        throw new GuardError(`The argument is greater than ${max}`, key);
}

export function againstAtLeast(key: string, argument: number, min: number) {
    if (argument < min)
        throw new GuardError(`The argument is less than ${min}`, key);
}

export function againstAtLeastOneElement(key: string, argument: any[]) {
    if (argument.length === 0)
        throw new GuardError("The argument is empty", key);
}

export function againstBadFormat(key: string, argument: string, regex: RegExp) {
    if (!regex.test(argument))
        throw new GuardError("The argument has a bad format", key);
}

export function againstBadEnumValue(key: string, e: { [s: number]: string }, argument: any) {
    if (!Object.keys(e).some(key => e[key as any] === argument))
        throw new GuardError("The argument is not part of the enum", key);
}