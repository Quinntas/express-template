export function validateEnum(e: {[s: number]: string}, argument: any) {
    return Object.keys(e).some((key) => e[key as any] === argument);
}

export function validateString(argument: any): argument is string {
    return typeof argument === 'string';
}

export function validateNumber(argument: any): argument is number {
    return typeof argument === 'number';
}

export function validateBoolean(argument: any): argument is boolean {
    return typeof argument === 'boolean';
}

export function validateNullOrUndefined(argument: any): argument is null {
    return argument === null || argument === undefined;
}

export function validateArray(argument: any): argument is object {
    if (validateNullOrUndefined(argument)) return false;
    return Array.isArray(argument);
}

export function validateObject(argument: any): argument is object {
    if (validateNullOrUndefined(argument)) return false;
    if (typeof argument !== 'object') return false;
    return !validateArray(argument);
}
