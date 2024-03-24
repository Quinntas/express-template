import {expect, test} from 'vitest';
import {jwtDecode, jwtSign} from './jsonWebToken';

const secret = 'i do not luv donuts';

const payload = {
    superSecret: 'i luv donuts',
};

test('Json Web Token - Sign and Decode - Valid', () => {
    const token = jwtSign(payload, secret);
    expect(token).toEqual(expect.any(String));

    const decoded = jwtDecode(token);
    expect(decoded).toEqual(
        expect.objectContaining({
            superSecret: 'i luv donuts',
        }),
    );
});

test('Json Web Token - Sign - Invalid secret with primitives', () => {
    expect(() => {
        jwtSign(payload, null as any);
    }).toThrowError();

    expect(() => {
        jwtSign(payload, 123 as any);
    }).toThrowError();

    expect(() => {
        jwtSign(payload, false as any);
    }).toThrowError();

    expect(() => {
        jwtSign(payload, true as any);
    }).toThrowError();

    expect(() => {
        jwtSign(payload, {} as any);
    }).toThrowError();

    expect(() => {
        jwtSign(payload, [] as any);
    }).toThrowError();
});

test('Json Web Token - Sign - Invalid with primitives', () => {
    expect(() => {
        jwtSign(123 as any, secret);
    }).toThrowError();

    expect(() => {
        jwtSign(false as any, secret);
    }).toThrowError();

    expect(() => {
        jwtSign(true as any, secret);
    }).toThrowError();

    expect(() => {
        jwtSign('foo' as any, secret);
    }).toThrowError();

    expect(() => {
        jwtSign([] as any, secret);
    }).toThrowError();
});

test('Json Web Token - Decode - Invalid with primitives', () => {
    expect(() => {
        jwtDecode(123 as any);
    }).toThrowError();

    expect(() => {
        jwtDecode(false as any);
    }).toThrowError();

    expect(() => {
        jwtDecode(true as any);
    }).toThrowError();

    expect(() => {
        jwtDecode({} as any);
    }).toThrowError();

    expect(() => {
        jwtDecode([] as any);
    }).toThrowError();

    expect(() => {
        jwtDecode(null!);
    }).toThrowError();
});
