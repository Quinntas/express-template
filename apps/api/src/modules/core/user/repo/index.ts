import {rwMysqlConn} from '../../../../infra/connections/mysql';
import {redisClient} from '../../../../infra/connections/redis';
import {userTable} from '../infra/database/user.table';
import {userMapper} from '../mapper';
import {UserRepo} from './user.repo';

export const userRepo = new UserRepo({
    table: userTable,
    readConn: rwMysqlConn,
    writeConn: rwMysqlConn,
    mapper: userMapper,
    redisClient,
});
