import {HttpError} from '../../../../../lib/errors';

export const invalidEmailOrPassword = new HttpError(401, 'Invalid email or password');
