import {HttpError} from '../../../../../lib/web/errors';

export const emailAlreadyExists = new HttpError(409, 'Email already exists');
