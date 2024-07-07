import {env} from '../../../../common/env';
import {HttpResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../core/types/decodedExpressRequest';
import {Encryption} from '../../../../utils/encryption';
import {UserRolesEnum} from '../../domain/user';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo';
import {UserCreateDTO, UserCreateResponseDTO} from './userCreateDTO';
import {emailAlreadyExists} from './userCreateErrors';
import {Err, Ok} from "ts-results";

export async function userCreateUseCase(request: DecodedExpressRequest<UserCreateDTO, null>) {
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const res = await userRepo.insert({
        email,
        password: Encryption.encrypt(password, env.PEPPER),
        role: UserRolesEnum.CLIENT,
    })

    if (!res.ok) return Err(emailAlreadyExists);

    return Ok<HttpResponse<UserCreateResponseDTO>>({
        statusCode: 201,
        data: {
            message: 'User created successfully',
        },
    });
}
