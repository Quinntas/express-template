export function pipe<
    F extends AnyFunc[],
    FirstFn extends (v: any) => [] extends F ? any : Parameters<F[0]>[0],
>(
    arg: Parameters<FirstFn>[0],
    firstFn: FirstFn,
    ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): LastFnReturnType<F, ReturnType<FirstFn>> {
    // @ts-ignore
    return (fns as AnyFunc[]).reduce((acc, fn) => fn(acc), firstFn(arg));
}

type AnyFunc = (...arg: any) => any;

type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [
        (...args: infer A) => infer B
    ]
    ? [...Acc, (...args: A) => B]
    : F extends [(...args: infer A) => any, ...infer Tail]
        ? Tail extends [(arg: infer B) => any, ...any[]]
            ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
            : Acc
        : Acc;

type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [
    ...any[],
    (...arg: any) => infer R
] ? R : Else;


