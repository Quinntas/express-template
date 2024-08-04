import {Err, Ok, Result} from 'ts-results';
import {env} from '../../../../../common/env';
import {event} from '../../../../../infra/events/event';
import {GuardError, HttpError, RepoError, RepoErrorCodes} from '../../../../../lib/errors';
import {DTO} from '../../../../../lib/types/dto';
import {Encryption} from '../../../../../utils/encryption';
import {UserRolesEnum} from '../../domain/user';
import {validateUserEmail} from '../../domain/valueObjects/user.email.valueObject';
import {validateUserPassword} from '../../domain/valueObjects/user.password.valueObject';
import {userRepo} from '../../repo';
import {UserCreateDto, UserCreateResponseDTO} from './userCreate.dto';
import {emailAlreadyExists} from './userCreate.errors';

export async function userCreateUsecase(request: DTO<UserCreateDto>): Promise<Result<UserCreateResponseDTO, HttpError | GuardError | RepoError>> {
    const guardRes = Result.all(validateUserEmail(request.data.email), validateUserPassword(request.data.password));

    if (!guardRes.ok) return Err(guardRes.val);

    const values = {
        email: guardRes.val[0],
        password: Encryption.encrypt(guardRes.val[1], env.PEPPER),
        role: UserRolesEnum.CLIENT,
    };

    const res = await userRepo.insert({
        transaction: request.repo?.transaction,
        values,
    });

    if (!res.ok) {
        if (res.val.errorCode === RepoErrorCodes.ER_DUP_ENTRY) return Err(emailAlreadyExists);
        return Err(res.val);
    }

    const id = res.val[0].insertId;

    await event.dispatch('userCreated', {
        id,
    });

    return Ok<UserCreateResponseDTO>({
        insertId: id,
        message: 'User created successfully',
    });
}
