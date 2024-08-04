import {HttpError} from '../../../../../lib/errors';

export const emailAlreadyExists = new HttpError(409, 'Email already exists');
