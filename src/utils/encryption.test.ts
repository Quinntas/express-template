import {expect, test} from 'vitest';
import {compare, createRandomString, encrypt, hashString, parseEncryptedString, randomString} from './encryption';

const pepper = 'uwu';

test('Encryption - Encryption data - Valid', () => {
    const encryptedData = encrypt('password', pepper);
    expect(encryptedData).toEqual(expect.any(String));

    const parsedEncryptedData = parseEncryptedString(encryptedData);
    expect(parsedEncryptedData).toEqual(
        expect.objectContaining({
            salt: expect.any(String),
            iterations: expect.any(Number),
            hash: expect.any(String),
        }),
    );

    expect(compare(encrypt('password', pepper, parsedEncryptedData.iterations, parsedEncryptedData.salt), encryptedData)).toBe(true);
});

test('Encryption - Encryption data - Invalid', () => {
    const encryptedData = encrypt('password', pepper);
    const parsedEncryptedData = parseEncryptedString(encryptedData);
    expect(compare(encrypt('password123', pepper, parsedEncryptedData.iterations, parsedEncryptedData.salt), encryptedData)).toBe(false);

    expect(() => {
        encrypt(123 as any, pepper);
    }).toThrowError();
});

test('Encryption - Hash string', () => {
    expect(hashString('password')).toEqual(expect.any(String));

    expect(() => {
        hashString(123 as any);
    }).toThrowError();

    expect(() => {
        hashString(null as any);
    }).toThrowError();

    expect(() => {
        hashString(undefined as any);
    }).toThrowError();

    expect(() => {
        hashString({} as any);
    }).toThrowError();

    expect(() => {
        hashString([] as any);
    }).toThrowError();
});

test('Encryption - Random String', () => {
    expect(randomString(6, 'ABCDEFGHIJKLMNOPQTUVWXYZ0123456789')).toEqual(expect.any(String));
});

test('Encryption - Create random string ', () => {
    expect(createRandomString(6)).toEqual(expect.any(String));
});
