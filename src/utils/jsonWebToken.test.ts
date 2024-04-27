import {expect, test, vi} from 'vitest';
import {JWT} from './jsonWebToken';

vi.mock('./env', () => ({
    env: {
        JWT_SECRET: 'test-jwt',
    },
}));

const payload = {
    superSecret: 'i luv donuts',
};

test('Json Web Token - Sign and Decode - Valid', () => {
    const token = JWT.sign(payload);
    expect(token).toEqual(expect.any(String));

    const decoded = JWT.decode(token);
    expect(decoded).toEqual(
        expect.objectContaining({
            superSecret: 'i luv donuts',
        }),
    );
});

test('Json Web Token - Sign - Invalid with primitives', () => {
    expect(() => {
        JWT.sign(123 as any);
    }).toThrowError();

    expect(() => {
        JWT.sign(false as any);
    }).toThrowError();

    expect(() => {
        JWT.sign(true as any);
    }).toThrowError();

    expect(() => {
        JWT.sign('foo' as any);
    }).toThrowError();

    expect(() => {
        JWT.sign([] as any);
    }).toThrowError();
});

test('Json Web Token - Decode - Invalid with primitives', () => {
    expect(() => {
        JWT.decode(123 as any);
    }).toThrowError();

    expect(() => {
        JWT.decode(false as any);
    }).toThrowError();

    expect(() => {
        JWT.decode(true as any);
    }).toThrowError();

    expect(() => {
        JWT.decode({} as any);
    }).toThrowError();

    expect(() => {
        JWT.decode([] as any);
    }).toThrowError();

    expect(() => {
        JWT.decode(null!);
    }).toThrowError();
});
