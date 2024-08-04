import {Ok} from 'ts-results';
import {againstNotBetween, againstNotString, againstNullOrUndefined} from '../../../../../lib/guard';
import {pipe} from '../../../../../utils/pipe';

export function validateUserPassword(password?: string) {
    return pipe(
        password,
        (password) => againstNullOrUndefined('password', password),
        (res) => {
            if (!res.ok) return res;
            return againstNotString('password', password);
        },
        (res) => {
            if (!res.ok) return res;
            return againstNotBetween('password', res.val, 8, 20);
        },
        (res) => {
            if (!res.ok) return res;
            return Ok<string>(res.val);
        },
    );
}
