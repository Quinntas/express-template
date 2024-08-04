import {rwMysqlConn} from '../../../../infra/connections/mysql';
import {redisClient} from '../../../../infra/connections/redis';
import {fileTable} from '../infra/database/file.table';
import {fileMapper} from '../mapper';
import {FileRepo} from './file.repo';

export const fileRepo = new FileRepo({
    table: fileTable,
    readConn: rwMysqlConn,
    writeConn: rwMysqlConn,
    mapper: fileMapper,
    redisClient,
});
