import {Ok} from 'ts-results';
import {pipe} from 'typescript-utils/src/pipe';
import {stringGuardPipeline} from '../../../../../lib/pipelines/string.guard.pipeline';

export namespace UserPassword {
    export const key = 'password';

    export function validate(value: unknown) {
        return pipe(stringGuardPipeline(key, 8, 20)).pipe((res) => {
            if (!res.ok) return res;
            return Ok(res.val);
        })(value);
    }
}
