import {againstAtLeast, againstAtMost, againstNullOrUndefined} from "../../../../core/guard";

export function validateUserPassword(password: string) {
    againstNullOrUndefined("password", password)
    againstAtLeast("password", password.length, 6)
    againstAtMost("password", password.length, 20)
    return password;
}