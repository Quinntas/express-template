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
import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4";
import {v1Resolvers, v1TypeDefs} from "./routers/v1";

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

async function createApolloServer() {
    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!'
            }
        }
    })

    await server.start()
    return server
}


const app = express();
const apolloServer = new ApolloServer({
    typeDefs: v1TypeDefs,
    resolvers: v1Resolvers
})

app.use(cors(corsOptions))
app.use(morganMiddleware)
app.use(compression(options))
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
            scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
            frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
    },
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

export const mainRouter = Router();

app.use(mainRouter);

async function healthCheck(req: DecodedExpressRequest<null, null>, res: Response) {
    return jsonResponse(res, 200, {message: "ok"});
}

get(mainRouter, "/", healthCheck);

(async () => {
    await apolloServer.start()
    app.use('/graphql', expressMiddleware(apolloServer))
})()

app.listen(env.PORT, () => {
    console.log(`[Server] Running at http://localhost:${env.PORT}`);
    console.log(`[Server] Running graphql at http://localhost:${env.PORT}/graphql`);
});