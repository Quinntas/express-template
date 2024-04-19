/*
For loops are faster than native JS iterators like map and forEach

Should you use this ? idk
 */

/**
 * Applies a callback function to each element of an array.
 *
 * @param {TElement[]} array - The array to iterate over.
 * @param {function} callback - The function to apply to each element.
 *                              This function accepts two parameters: the element value and the element index.
 * @returns {void}
 */
export function forEach<TElement>(array: TElement[], callback: (value: TElement, index: number) => void) {
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i);
    }
}

/**
 * Applies a mapping function to each element in an array and returns a new array with the results.
 *
 * @template TElement - The type of elements in the input array.
 * @template TResult - The type of elements in the resulting mapped array.
 * @param {TElement[]} array - The input array to map.
 * @param {(value: TElement, index: number) => TResult} callback - The mapping function to apply to each element.
 * @return {TResult[]} - A new array with the mapped elements.
 */
export function map<TElement, TResult>(array: TElement[], callback: (value: TElement, index: number) => TResult): TResult[] {
    let result: TResult[] = [];
    forEach(array, (value, index) => {
        const callRes = callback(value, index);
        if (callRes !== undefined && callRes !== null) result.push(callRes);
    });
    return result;
}

/**
 * Finds the first element in the specified array that satisfies the provided testing function.
 *
 * @param {TElement[]} array - The array to search in.
 * @param {Function} callback - A function that tests each element of the array.
 *     - The callback function should accept two parameters:
 *         - value: The current element being processed in the array.
 *         - index: The index of the current element being processed in the array.
 *     - The callback function should return a boolean value indicating whether the element satisfies the condition.
 *
 * @returns {TElement | undefined} - The first element in the array that satisfies the testing function,
 *     or undefined if no such element is found.
 */
export function find<TElement>(array: TElement[], callback: (value: TElement, index: number) => boolean): TElement | undefined {
    let foundElement: TElement | undefined;
    forEach(array, (value, index) => {
        if (!foundElement && callback(value, index)) {
            foundElement = value;
        }
    });
    return foundElement;
}

/**
 * Finds the index of the first element in the array that satisfies the provided testing function.
 *
 * @param {TElement[]} array - The array to search.
 * @param {(value: TElement, index: number) => boolean} callback - The testing function.
 * @return {number} - The index of the first matching element, or -1 if no element is found.
 */
export function findIndex<TElement>(array: TElement[], callback: (value: TElement, index: number) => boolean): number {
    let foundIndex = -1;
    forEach(array, (value, index) => {
        if (foundIndex === -1 && callback(value, index)) {
            foundIndex = index;
        }
    });
    return foundIndex;
}
