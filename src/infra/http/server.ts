import express from "express";
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from "cors";
import {morganMiddleware} from "../../utils/morgan";
import {env} from "../../utils/env";
import {v1Router} from "../routers/v1Router";
import {compressionOptions, corsOptions} from "./config";

export const server = express();

server.use(compression(compressionOptions))
server.use(cors(corsOptions))
server.use(morganMiddleware)
server.use(helmet())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.use('/api/v1', v1Router)

server.listen(env.PORT, () => {
    env.NODE_ENV === "development" && console.log(`[Server] is running on port ${env.PORT}`);
});