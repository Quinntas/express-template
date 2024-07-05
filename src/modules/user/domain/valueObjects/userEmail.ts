import {againstBadFormat, againstNotString, againstNullOrUndefined} from '../../../../core/guard';

const emailRegex = /@/;

export function validateUserEmail(email: string) {
    againstNullOrUndefined('email', email);
    againstNotString('email', email);
    againstBadFormat('email', email, emailRegex);
    return email;
}
