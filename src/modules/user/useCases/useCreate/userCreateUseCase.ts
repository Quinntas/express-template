import {Response} from 'express';
import {v4} from 'uuid';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {Encryption} from '../../../../utils/encryption';
import {env} from '../../../../utils/env';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserName} from '../../domain/valueObjects/userName';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo/userRepo';
import {UserCreateDTO} from './userCreateDTO';

export async function userCreateUseCase(request: DecodedExpressRequest<UserCreateDTO, null>, response: Response) {
    const name = validateUserName(request.bodyObject.name!);
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const result = await userRepo.insert({
        pid: v4(),
        name,
        email,
        password: Encryption.encrypt(password, env.PEPPER),
        roleId: env.DEFAULT_ROLE_ID,
    });

    if (!result) throw new HttpError(500, 'Error creating user');

    return jsonResponse(response, 201, {message: 'User created successfully'});
}
