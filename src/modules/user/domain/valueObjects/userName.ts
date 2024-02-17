import {againstAtLeast, againstAtMost, againstNullOrUndefined} from "../../../../core/guard";

export function validateUserName(name: string) {
    againstNullOrUndefined("name", name)
    againstAtLeast("name", name.length, 3)
    againstAtMost("name", name.length, 50)
    return name.toUpperCase();
}