import {expect, test} from 'vitest';
import {pipe} from './pipe';

const add2 = (x: number) => x + 2;
const multiply3 = (x: number) => x * 3;
const subtract5 = (x: number) => x - 5;

test('Pipe - should correctly pipe functions in order', () => {
    const result = pipe(5, add2, multiply3, subtract5);
    expect(result).toBe((5 + 2) * 3 - 5);
});

test('Pipe - should handle functions with different argument and return types', () => {
    const result = pipe(
        'hello',
        (str) => str.length,
        (length) => length * 2,
    );
    expect(result).toBe(10);
});
