import {expect, test} from 'vitest';
import {find, findIndex, forEach, map} from './iterators';

test('forEach function from iterators', () => {
    const array = [1, 2, 3];
    let sum = 0;
    forEach<number>(array, (value) => {
        sum += value;
    });
    expect(sum).toBe(6);
});

test('map function from iterators', () => {
    const array = [1, 2, 3];
    const result = map<number, number>(array, (value) => value * 2);
    expect(result).toStrictEqual([2, 4, 6]);
});

test('find function from myArray', () => {
    const array = [1, 2, 3, 4, 5];
    const foundElement = find<number>(array, (value) => value % 2 === 0);
    expect(foundElement).toBe(2);
});

test('findIndex function from myArray', () => {
    const array = [1, 2, 3, 4, 5];
    const foundIndex = findIndex<number>(array, (value) => value % 2 === 0);
    expect(foundIndex).toBe(1);
});
