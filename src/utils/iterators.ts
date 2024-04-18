import {validateNullOrUndefined} from './validations';

/*
For loops are faster than native JS iterators like map and forEach

Should you use this ? idk
 */

export function forEach<T extends any>(obj: T[], callback: (value: T, index: number) => void) {
    for (let i = 0; i < obj.length; i++) {
        callback(obj[i], i);
    }
}

export function map<T extends any>(obj: T[], callback: (value: T, index: number) => any) {
    let res = [];
    for (let i = 0; i < obj.length; i++) {
        const callRes = callback(obj[i], i);
        if (!validateNullOrUndefined(callRes)) res.push(callRes);
    }
    return res;
}
