import {pipe} from 'typescript-utils/src/pipe';
import {againstNotBetween, againstNotString} from '../ddd/guard';

export const stringGuardPipeline = (
    key: string,
    min: number = 1,
    max: number = Infinity,
) =>
    pipe((val) => {
        return againstNotString(key, val);
    }).pipe((res) => {
        if (!res.ok) return res;
        return againstNotBetween(key, res.val, min, max);
    });
