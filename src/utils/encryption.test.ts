import {expect, test} from 'vitest';
import {Encryption} from './encryption';

const pepper = 'uwu';

test('Encryption - Encryption data - Valid', () => {
    const encryptedData = Encryption.encrypt('password', pepper);
    expect(encryptedData).toEqual(expect.any(String));

    const parsedEncryptedData = Encryption.parseEncryptedString(encryptedData);
    expect(parsedEncryptedData).toEqual(
        expect.objectContaining({
            salt: expect.any(String),
            iterations: expect.any(Number),
            hash: expect.any(String),
        }),
    );

    expect(Encryption.compare(Encryption.encrypt('password', pepper, parsedEncryptedData.iterations, parsedEncryptedData.salt), encryptedData)).toBe(true);
});

test('Encryption - Encryption data - Invalid', () => {
    const encryptedData = Encryption.encrypt('password', pepper);
    const parsedEncryptedData = Encryption.parseEncryptedString(encryptedData);
    expect(Encryption.compare(Encryption.encrypt('password123', pepper, parsedEncryptedData.iterations, parsedEncryptedData.salt), encryptedData)).toBe(false);

    expect(() => {
        Encryption.encrypt(123 as any, pepper);
    }).toThrowError();
});

test('Encryption - Hash string', () => {
    expect(Encryption.hashString('password')).toEqual(expect.any(String));

    expect(() => {
        Encryption.hashString(123 as any);
    }).toThrowError();

    expect(() => {
        Encryption.hashString(null as any);
    }).toThrowError();

    expect(() => {
        Encryption.hashString(undefined as any);
    }).toThrowError();

    expect(() => {
        Encryption.hashString({} as any);
    }).toThrowError();

    expect(() => {
        Encryption.hashString([] as any);
    }).toThrowError();
});

test('Encryption - Random String', () => {
    expect(Encryption.randomString(6, 'ABCDEFGHIJKLMNOPQTUVWXYZ0123456789')).toEqual(expect.any(String));
});

test('Encryption - Create random string ', () => {
    expect(Encryption.createRandomString(6)).toEqual(expect.any(String));
});
