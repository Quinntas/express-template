import {HttpError} from '../../../../core/errors';

export const userNotFound = new HttpError(404, 'User not found');

export const invalidEmailOrPassword = new HttpError(401, 'Invalid email or password');
