import {env} from '../../../../common/env';
import {HttpResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../core/types/decodedExpressRequest';
import {redisClient} from '../../../../infra/database/redis';
import {Encryption} from '../../../../utils/encryption';
import {JWT} from '../../../../utils/jsonWebToken';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo';
import {loginRedisKeyPrefix, loginTokenExpiration} from './userLoginConstants';
import {PrivateLoginToken, PublicLoginToken, UserLoginDTO, UserLoginResponseDTO} from './userLoginDTO';
import {invalidEmailOrPassword, userNotFound} from './userLoginErrors';
import {Err, Ok} from "ts-results";

export async function userLoginUseCase(request: DecodedExpressRequest<UserLoginDTO, null>) {
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const result = await userRepo.selectByEmail(email);

    if (!result.ok) return Err(userNotFound);

    const user = result.unwrap();

    const parsedPassword = Encryption.parseEncryptedString(user.password);

    if (!Encryption.compare(Encryption.encrypt(password, env.PEPPER, parsedPassword.iterations, parsedPassword.salt), user.password))
        return Err(invalidEmailOrPassword);

    const expireDate = Math.floor(Date.now() / 1000) + loginTokenExpiration;

    const publicTokenObject: PublicLoginToken = {
        user: {
            pid: user.pid,
        },
    };
    const publicToken: string = JWT.sign(publicTokenObject, {
        expiresIn: expireDate,
    });

    const privateTokenObject: PrivateLoginToken = {
        user,
    };
    const privateToken: string = JWT.sign(privateTokenObject, {
        expiresIn: expireDate,
    });

    await redisClient.set(loginRedisKeyPrefix + user.pid, privateToken, loginTokenExpiration);

    return Ok<HttpResponse<UserLoginResponseDTO>>({
        data: {
            token: publicToken,
            expiresIn: loginTokenExpiration,
            expireDate,
        },
    });
}
