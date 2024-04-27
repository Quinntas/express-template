import {Response} from 'express';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {redisClient} from '../../../../infra/database/redis';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {Encryption} from '../../../../utils/encryption';
import {env} from '../../../../utils/env';
import {JWT} from '../../../../utils/jsonWebToken';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo/userRepo';
import {loginRedisKeyPrefix, loginTokenExpiration} from './userLoginConstants';
import {PrivateLoginToken, PublicLoginToken, UserLoginDTO, UserLoginResponseDTO} from './userLoginDTO';

export async function userLoginUseCase(request: DecodedExpressRequest<UserLoginDTO, null>, response: Response) {
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const result = await userRepo.selectByEmail(email);

    if (!result) throw new HttpError(404, 'User not found');

    const parsedPassword = Encryption.parseEncryptedString(result.password);

    if (!Encryption.compare(Encryption.encrypt(password, env.PEPPER, parsedPassword.iterations, parsedPassword.salt), result.password))
        throw new HttpError(401, 'Invalid email or password');

    const expireDate = Math.floor(Date.now() / 1000) + loginTokenExpiration;

    const publicTokenObject: PublicLoginToken = {
        userPid: result.pid,
    };
    const publicToken: string = JWT.sign(publicTokenObject, {
        expiresIn: expireDate,
    });

    const privateTokenObject: PrivateLoginToken = {
        userPid: result.pid,
        roleId: result.roleId,
        userEmail: result.email,
        userId: result.id,
    };
    const privateToken: string = JWT.sign(privateTokenObject, {
        expiresIn: expireDate,
    });

    await redisClient.set(loginRedisKeyPrefix + result.pid, privateToken, loginTokenExpiration);

    return jsonResponse<UserLoginResponseDTO>(response, 200, {
        token: publicToken,
        expiresIn: loginTokenExpiration,
        expireDate,
    });
}
