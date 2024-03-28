import {Response} from 'express';
import {v4} from 'uuid';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {encrypt} from '../../../../utils/encryption';
import {env} from '../../../../utils/env';
import {validateUserEmail} from '../../domain/valueObjects/userEmail';
import {validateUserName} from '../../domain/valueObjects/userName';
import {validateUserPassword} from '../../domain/valueObjects/userPassword';
import {userRepo} from '../../repo/userRepo';
import {CreateUserDTO} from './createUserDTO';

export async function createUserUseCase(request: DecodedExpressRequest<CreateUserDTO, null>, response: Response) {
    const name = validateUserName(request.bodyObject.name!);
    const email = validateUserEmail(request.bodyObject.email!);
    const password = validateUserPassword(request.bodyObject.password!);

    const result = await userRepo.insert({
        pid: v4(),
        name,
        email,
        password: encrypt(password, env.PEPPER),
    });

    if (!result) throw new HttpError(500, 'Error creating user');

    return jsonResponse(response, 201, {message: 'User created successfully'});
}
