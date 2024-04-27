export namespace NumberUtils {
    export function toCurrencyString(num: number, locale: Intl.LocalesArgument, currency: string) {
        return num.toLocaleString(locale, {
            style: 'currency',
            currency,
        });
    }
}
