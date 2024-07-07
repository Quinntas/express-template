import {HttpError} from '../../../../core/errors';

export const emailAlreadyExists = new HttpError(409, 'Email already exists');
