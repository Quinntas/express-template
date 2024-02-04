import express, {Response, Router} from "express";
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from "cors";
import {morganMiddleware} from "../utils/morgan";
import {env} from "../utils/env";
import {DecodedExpressRequest} from "../types/decodedExpressRequest";
import {jsonResponse} from "../core/responses";
import {get} from "../core/handleRequest";
import {v1Router} from "./routers/v1Router";

const corsOptions = {
    origin: '*',
    credentials: true
}

const options = {
    threshold: '1kb',
    filter: (req: Request, res: Response) => {
        if (res.getHeader('x-no-compression'))
            return false

        if (res.statusCode === 304)
            return false

        let type = res.getHeader('Content-Type') as string[]

        if (type && type.indexOf('text/event-stream') > -1)
            return false

        return compression.filter(req, res)
    }
}

const app = express();

app.use(cors(corsOptions))
app.use(morganMiddleware)
app.use(compression(options))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

export const mainRouter = Router();

app.use(mainRouter);
app.use('/api/v1', v1Router)

async function healthCheck(req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, {message: "ok"});
}

get(mainRouter, "/", healthCheck);

app.listen(env.PORT, () => {
    console.log("[Server] Running at http://localhost:" + env.PORT);
});