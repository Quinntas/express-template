import {againstBadFormat, againstNotString, againstNullOrUndefined} from '../../../../core/guard';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export function validateUserEmail(email: string) {
    againstNullOrUndefined('email', email);
    againstNotString('email', email);
    againstBadFormat('email', email, emailRegex);
    return email;
}
