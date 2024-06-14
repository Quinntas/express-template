import {Response} from 'express';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../core/types/decodedExpressRequest';
import {Encryption} from '../../../../utils/encryption';
import {env} from '../../../../utils/env';
import {UserRolesEnum} from '../../domain/user';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo/userRepo';
import {UserCreateDTO} from './userCreateDTO';

export async function userCreateUseCase(request: DecodedExpressRequest<UserCreateDTO, null>, response: Response) {
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const result = await userRepo.insert({
        email,
        password: Encryption.encrypt(password, env.PEPPER),
        role: UserRolesEnum.CLIENT,
    });

    if (!result) throw new HttpError(500, 'Error creating user');

    return jsonResponse(response, 201, {message: 'User created successfully'});
}
