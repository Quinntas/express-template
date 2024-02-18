import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {HttpError} from "../../../../core/errors";
import {PrivateLoginToken, PublicLoginToken} from "../../useCases/login/loginDTO";
import {redisClient} from "../../../../infra/database/redis";
import {loginRedisKeyPrefix} from "../../useCases/login/loginConstants";
import {UserDecodedExpressRequest} from "../http/userDecodedExpressRequest";

export async function ensureUserAuthenticated(req: UserDecodedExpressRequest<null, null>, res: Response, next: NextFunction) {
    const token = req.headers.authorization

    if (!token)
        throw new HttpError(401, 'No token provided')

    const tokenValue = token.split(' ')[1]

    const publicDecoded: PublicLoginToken = jwt.decode(tokenValue, {json: true}) as PublicLoginToken

    if (!publicDecoded)
        throw new HttpError(401, 'Invalid token')

    const privateToken = await redisClient.get(loginRedisKeyPrefix + publicDecoded.userPid)

    if (!privateToken)
        throw new HttpError(401, 'Token not found')

    const privateDecoded: PrivateLoginToken = jwt.decode(privateToken, {json: true}) as PrivateLoginToken

    req.user = {
        pid: privateDecoded.userPid,
        id: privateDecoded.userId
    }

    next()
}