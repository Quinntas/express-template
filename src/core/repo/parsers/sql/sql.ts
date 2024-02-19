import {Primitive} from "../../../../types/primitives";

export function sql(strings: TemplateStringsArray, ...values: Primitive[]): [string, Primitive[]] {
    let result = strings[0] ?? '';
    for (let i = 1; i < strings.length; i++)
        result += `$${i}${strings[i] ?? ''}`;
    return [result, values]
}
