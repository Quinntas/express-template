import {Ok} from 'ts-results';
import {againstNotBetween, againstNotString, againstNullOrUndefined} from '../../../../../lib/guard';
import {pipe} from '../../../../../utils/pipe';

export function validateFileType(type?: string) {
    return pipe(
        type,
        (type) => againstNullOrUndefined('type', type),
        (res) => {
            if (!res.ok) return res;
            return againstNotString('type', type);
        },
        (res) => {
            if (!res.ok) return res;
            return againstNotBetween('type', res.val, 1, 191);
        },
        (res) => {
            if (!res.ok) return res;
            return Ok<string>(res.val);
        },
    );
}
