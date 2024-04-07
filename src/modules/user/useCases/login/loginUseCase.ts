import {Response} from 'express';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {redisClient} from '../../../../infra/database/redis';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {compare, encrypt, parseEncryptedString} from '../../../../utils/encryption';
import {env} from '../../../../utils/env';
import {jwtSign} from '../../../../utils/jsonWebToken';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo/userRepo';
import {loginRedisKeyPrefix, loginTokenExpiration} from './loginConstants';
import {LoginDTO, LoginResponseDTO, PrivateLoginToken, PublicLoginToken} from './loginDTO';

export async function loginUseCase(request: DecodedExpressRequest<LoginDTO, null>, response: Response) {
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const result = await userRepo.selectByEmail(email);

    if (!result) throw new HttpError(404, 'User not found');

    const parsedPassword = parseEncryptedString(result.password);

    if (!compare(encrypt(password, env.PEPPER, parsedPassword.iterations, parsedPassword.salt), result.password))
        throw new HttpError(401, 'Invalid email or password');

    const expireDate = Math.floor(Date.now() / 1000) + loginTokenExpiration;

    const publicTokenObject: PublicLoginToken = {
        userPid: result.pid,
    };
    const publicToken: string = jwtSign(publicTokenObject, {
        expiresIn: expireDate,
    });

    const privateTokenObject: PrivateLoginToken = {
        userPid: result.pid,
        roleId: result.roleId,
        userEmail: result.email,
        userId: result.id,
    };
    const privateToken: string = jwtSign(privateTokenObject, {
        expiresIn: expireDate,
    });

    await redisClient.set(loginRedisKeyPrefix + result.pid, privateToken, loginTokenExpiration);

    return jsonResponse<LoginResponseDTO>(response, 200, {
        token: publicToken,
        expiresIn: loginTokenExpiration,
        expireDate,
    });
}
