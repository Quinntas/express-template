import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as http from 'node:http';
import {env} from '../../common/env';
import {log} from '../../modules/shared/infra/log';
import {morganMiddleware} from '../../utils/morgan';
import {lazyConnections} from '../connections/lazyConnections';
import {v1Router} from '../routers/v1.router';
import {compressionOptions, corsOptions} from './config';

export const app = express();

app.use(compression(compressionOptions));
app.use(cors(corsOptions));
app.use(morganMiddleware);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/v1', v1Router);

let server: http.Server | null = null;

export function listen() {
    server = app.listen(env.PORT, '0.0.0.0', async () => {
        await lazyConnections();
        env.NODE_ENV === 'development' &&
            log.info(`[SERVER] is running on port ${env.PORT}`);
    });
}

export function close() {
    if (!server) throw new Error('App has not been started');
    server.close();
}
