import {describe, expect, it} from 'vitest';
import {validateArray, validateBoolean, validateEnum, validateNullOrUndefined, validateNumber, validateObject, validateString} from './validations';

describe('Validation Functions', () => {
    enum TestEnum {
        ONE = 'ONE',
        TWO = 'TWO',
    }

    describe('validateEnum()', () => {
        it('checks if argument matches enum values', () => {
            expect(validateEnum(TestEnum, 'ONE')).toBeTruthy();
            expect(validateEnum(TestEnum, 'THREE')).toBeFalsy();
        });
    });

    describe('validateString()', () => {
        it('checks if argument is a string', () => {
            expect(validateString('string')).toBeTruthy();
            expect(validateString(123)).toBeFalsy();
        });
    });

    describe('validateNumber()', () => {
        it('checks if argument is a number', () => {
            expect(validateNumber(123)).toBeTruthy();
            expect(validateNumber('123')).toBeFalsy();
        });
    });

    describe('validateBoolean()', () => {
        it('checks if argument is a boolean', () => {
            expect(validateBoolean(true)).toBeTruthy();
            expect(validateBoolean(false)).toBeTruthy();
            expect(validateBoolean(0)).toBeFalsy();
        });
    });

    describe('validateNullOrUndefined()', () => {
        it('checks if argument is null or undefined', () => {
            expect(validateNullOrUndefined(null)).toBeTruthy();
            expect(validateNullOrUndefined(undefined)).toBeTruthy();
            expect(validateNullOrUndefined('')).toBeFalsy();
        });
    });

    describe('validateArray()', () => {
        it('checks if argument is an array', () => {
            expect(validateArray([1, 2, 3])).toBeTruthy();
            expect(validateArray('123')).toBeFalsy();
        });
    });

    describe('validateObject()', () => {
        it('checks if argument is an object', () => {
            expect(validateObject({key: 'value'})).toBeTruthy();
            expect(validateObject('string')).toBeFalsy();
            expect(validateObject([1, 2, 3])).toBeFalsy();
        });
    });
});
