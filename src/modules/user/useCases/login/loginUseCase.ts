import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {validateUserEmail} from "../../domain/valueObjects/userEmail";
import {getUser} from "../../repo/userRepo";
import {HttpError} from "../../../../core/errors";
import {jsonResponse} from "../../../../core/responses";
import {LoginDTO, LoginResponseDTO, PrivateLoginToken, PublicLoginToken} from "./loginDTO";
import {validateUserPassword} from "../../domain/valueObjects/userPassword";
import {compare, encrypt, parseEncryptedString} from "../../../../utils/encryption";
import {loginRedisKeyPrefix, loginTokenExpiration} from "./loginConstants";
import jwt from 'jsonwebtoken'
import {env} from "../../../../utils/env";
import {redisClient} from "../../../../infra/database/redis";

export async function LoginUseCase(request: DecodedExpressRequest<LoginDTO, null>, response: Response) {
    const email = validateUserEmail(request.bodyObject.email)
    const password = validateUserPassword(request.bodyObject.password)

    const result = await getUser(undefined, email)

    if (!result)
        throw new HttpError(404, "User not found")

    const parsedPassword = parseEncryptedString(result.password)

    if (!compare(encrypt(password, parsedPassword.iterations, parsedPassword.salt), result.password))
        throw new HttpError(401, "Invalid password")

    const expireDate = Math.floor(Date.now() / 1000) + loginTokenExpiration

    const publicTokenObject: PublicLoginToken = {
        userPid: result.pid!,
        exp: expireDate
    }
    const publicToken: string = jwt.sign(publicTokenObject, env.JWT_SECRET)

    const privateTokenObject: PrivateLoginToken = {
        userPid: result.pid!,
        userId: result.id!,
        exp: expireDate
    }
    const privateToken: string = jwt.sign(privateTokenObject, env.JWT_SECRET)

    await redisClient.set(loginRedisKeyPrefix + result.pid, privateToken, loginTokenExpiration)

    return jsonResponse<LoginResponseDTO>(
        response,
        200,
        {
            token: publicToken,
            expiresIn: loginTokenExpiration,
            expireDate
        }
    )
}