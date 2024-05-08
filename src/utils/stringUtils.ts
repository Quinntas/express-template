import {InternalError} from '../core/errors';

export namespace StringUtils {
    export function removeSpaces(str: string, orientation: 'start' | 'end' | 'all' = 'all') {
        switch (orientation) {
            case 'start':
                return str.trimStart();

            case 'end':
                return str.trimEnd();

            case 'all':
                return str.trim();

            default:
                throw new InternalError('Orientation not found');
        }
    }

    export function toRaw(str: string) {
        return String.raw`${str}`;
    }
}
