import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import {env} from '../../common/env';
import {morganMiddleware} from '../../utils/morgan';
import {v1Router} from '../routers/v1Router';
import {compressionOptions, corsOptions} from './config';

export const server = express();

server.use(compression(compressionOptions));
server.use(cors(corsOptions));
server.use(morganMiddleware);
server.use(helmet());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use('/api/v1', v1Router);

server.listen(env.PORT, '0.0.0.0', () => {
    env.NODE_ENV === 'development' && console.log(`[Server] is running on port ${env.PORT}`);
});
