import {Ok} from 'ts-results';
import {againstBadFormat, againstNotBetween, againstNotString, againstNullOrUndefined} from '../../../../../lib/guard';
import {pipe} from '../../../../../utils/pipe';

// caio@gmail.com - valid
// caio@gmail - valid
// caio - invalid

const emailRegex = /^\S+@\S+\.\S+$/;

export function validateUserEmail(email?: string) {
    return pipe(
        email,
        (email) => againstNullOrUndefined('email', email),
        (res) => {
            if (!res.ok) return res;
            return againstNotString('email', email);
        },
        (res) => {
            if (!res.ok) return res;
            return againstNotBetween('email', res.val, 1, 191);
        },
        (res) => {
            if (!res.ok) return res;
            return againstBadFormat('email', res.val, emailRegex);
        },
        (res) => {
            if (!res.ok) return res;
            return Ok<string>(res.val);
        },
    );
}
