import {expect, test, vi} from 'vitest';
import {jwtDecode, jwtSign} from './jsonWebToken';

vi.mock('./env', () => ({
    env: {
        JWT_SECRET: 'test-jwt',
    },
}));

const payload = {
    superSecret: 'i luv donuts',
};

test('Json Web Token - Sign and Decode - Valid', () => {
    const token = jwtSign(payload);
    expect(token).toEqual(expect.any(String));

    const decoded = jwtDecode(token);
    expect(decoded).toEqual(
        expect.objectContaining({
            superSecret: 'i luv donuts',
        }),
    );
});

test('Json Web Token - Sign - Invalid with primitives', () => {
    expect(() => {
        jwtSign(123 as any);
    }).toThrowError();

    expect(() => {
        jwtSign(false as any);
    }).toThrowError();

    expect(() => {
        jwtSign(true as any);
    }).toThrowError();

    expect(() => {
        jwtSign('foo' as any);
    }).toThrowError();

    expect(() => {
        jwtSign([] as any);
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
