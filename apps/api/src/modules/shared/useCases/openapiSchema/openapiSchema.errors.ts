import {HttpError} from '../../../../lib/web/errors';

export const errorReadingFile = new HttpError(500, 'Error reading file');

export const errorParsingFile = new HttpError(500, 'Error parsing file');
