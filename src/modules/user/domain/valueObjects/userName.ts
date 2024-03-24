import {againstAtLeast, againstAtMost, againstNotString, againstNullOrUndefined} from '../../../../core/guard';

export function validateUserName(name: string) {
    againstNullOrUndefined('name', name);
    againstNotString('name', name);
    againstAtLeast('name', name.length, 3);
    againstAtMost('name', name.length, 50);
    return name.toUpperCase();
}
