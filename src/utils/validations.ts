export function validateEnum(e: {[s: number]: string}, argument: any) {
    return Object.keys(e).some((key) => e[key as any] === argument);
}
