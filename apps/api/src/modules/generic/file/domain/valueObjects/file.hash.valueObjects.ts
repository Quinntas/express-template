import {Ok} from 'ts-results';
import {againstNotBetween, againstNotString, againstNullOrUndefined} from '../../../../../lib/guard';
import {pipe} from '../../../../../utils/pipe';

export function validateFileHash(hash?: string) {
    return pipe(
        hash,
        (hash) => againstNullOrUndefined('hash', hash),
        (res) => {
            if (!res.ok) return res;
            return againstNotString('hash', hash);
        },
        (res) => {
            if (!res.ok) return res;
            return againstNotBetween('hash', res.val, 1, 191);
        },
        (res) => {
            if (!res.ok) return res;
            return Ok<string>(res.val);
        },
    );
}
