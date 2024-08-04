import {HttpError} from '../../../../../lib/web/errors';

export const invalidEmailOrPassword = new HttpError(401, 'Invalid email or password');
