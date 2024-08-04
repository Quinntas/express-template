import {Domain} from '../../../../lib/ddd/domain';
import {logTable} from '../infra/database/log.table';

export enum LogLevels {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export interface Logs extends Domain<typeof logTable> {
    level: LogLevels;
}
