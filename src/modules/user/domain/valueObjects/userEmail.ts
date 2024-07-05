import {againstBadFormat, againstNotString, againstNullOrUndefined} from '../../../../core/guard';

// caio@gmail.com - valid
// caio@gmail - valid
// caio - invalid

const emailRegex = /@/;

export function validateUserEmail(email: string) {
    againstNullOrUndefined('email', email);
    againstNotString('email', email);
    againstBadFormat('email', email, emailRegex);
    return email;
}
