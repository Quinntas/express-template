import {Ok} from 'ts-results';
import {againstNotBetween, againstNotString, againstNullOrUndefined} from '../../../../../lib/guard';
import {pipe} from '../../../../../utils/pipe';

export function validateFileBucket(bucket?: string) {
    return pipe(
        bucket,
        (bucket) => againstNullOrUndefined('bucket', bucket),
        (res) => {
            if (!res.ok) return res;
            return againstNotString('bucket', bucket);
        },
        (res) => {
            if (!res.ok) return res;
            return againstNotBetween('bucket', res.val, 1, 191);
        },
        (res) => {
            if (!res.ok) return res;
            return Ok<string>(res.val);
        },
    );
}
