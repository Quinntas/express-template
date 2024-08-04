import {Ok} from 'ts-results';
import {pipe} from 'typescript-utils/src/pipe';
import {againstBadFormat} from '../../../../../lib/ddd/guard';
import {stringGuardPipeline} from '../../../../../lib/pipelines/string.guard.pipeline';

export namespace UserEmail {
    export const emailRegex = /^\S+@\S+\.\S+$/;
    export const key = 'email';

    export function validate(value: unknown) {
        return pipe(stringGuardPipeline(key, 1, 191))
            .pipe((res) => {
                if (!res.ok) return res;
                return againstBadFormat(key, res.val, emailRegex);
            })
            .pipe((res) => {
                if (!res.ok) return res;
                return Ok(res.val);
            })(value);
    }
}
