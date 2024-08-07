import {Err, Ok, Result} from 'ts-results';
import {env} from '../../../../../common/env';
import {DTO} from '../../../../../lib/ddd/dto';
import {CacheService} from '../../../../../lib/services/cacheService';
import {
    GuardError,
    HttpError,
    RepoError,
    RepoErrorCodes,
} from '../../../../../lib/web/errors';
import {Encryption} from '../../../../../utils/encryption';
import {JWT} from '../../../../../utils/jsonWebToken';
import {UserEmail} from '../../domain/valueObjects/user.email.valueObject';
import {UserPassword} from '../../domain/valueObjects/user.password.valueObject';
import {userRepo} from '../../repo';
import {loginRedisKeyPrefix, loginTokenExpiration} from './userLogin.constants';
import {
    PrivateLoginToken,
    PublicLoginToken,
    UserLoginDto,
    UserLoginResponseDTO,
} from './userLogin.dto';
import {invalidEmailOrPassword} from './userLogin.errors';

export async function userLoginUsecase(
    request: DTO<UserLoginDto>,
    cacheService: CacheService,
): Promise<Result<UserLoginResponseDTO, HttpError | GuardError | RepoError>> {
    const guardRes = Result.all(
        UserEmail.validate(request.data.email),
        UserPassword.validate(request.data.password),
    );
    if (!guardRes.ok) return Err(guardRes.val);

    const result = await userRepo.selectByEmail(guardRes.val[0]);
    if (result.err) {
        if (result.val instanceof RepoError)
            if (result.val.errorCode === RepoErrorCodes.ER_NO_RECORD)
                return Err(invalidEmailOrPassword);
        return Err(result.val);
    }

    const user = result.unwrap();

    const parsedPassword = Encryption.parseEncryptedString(user.password);
    if (parsedPassword.err) return Err(parsedPassword.val);
    const {salt, iterations} = parsedPassword.val;
    const cmpEncrypt = Encryption.encrypt(
        guardRes.val[1],
        env.PEPPER,
        iterations,
        salt,
    );
    if (!Encryption.compare(cmpEncrypt, user.password))
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

    await cacheService.set(
        loginRedisKeyPrefix + user.pid,
        privateToken,
        loginTokenExpiration,
    );

    return Ok<UserLoginResponseDTO>({
        token: publicToken,
        expiresIn: loginTokenExpiration,
        expireDate,
    });
}
