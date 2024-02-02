import express, {Response, Router} from "express";
import {DecodedExpressRequest} from "./src/types/decodedExpressRequest";
import {jsonResponse} from "./src/core/responses";
import {get} from "./src/core/handleRequest";
import {userRouter} from "./src/modules/user/infra/userRouter";

const app = express();

export const mainRouter = Router();

app.use(express.json());

app.use(mainRouter);
app.use('/user', userRouter)

app.listen(3333, () => {
    console.log("server running on port 3333");
});


async function helloWorld(req: DecodedExpressRequest<any, any>, res: Response) {
    console.log(req.bodyObject);
    console.log(req.queryObject);
    return jsonResponse(res, 201, {message: "Hello World"});
}


get(mainRouter, "/", helloWorld);