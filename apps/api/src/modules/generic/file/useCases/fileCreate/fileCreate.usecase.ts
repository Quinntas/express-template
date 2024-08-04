import {Err, Ok, Result} from 'ts-results';
import {GuardError, HttpError, RepoError} from '../../../../../lib/errors';
import {DTO} from '../../../../../lib/types/dto';
import {validateFileBucket} from '../../domain/valueObjects/file.bucket.valueObjects';
import {validateFileHash} from '../../domain/valueObjects/file.hash.valueObjects';
import {validateFileType} from '../../domain/valueObjects/file.type.valueObjects';
import {fileRepo} from '../../repo';
import {FileCreateDto, FileCreateResponseDto} from './fileCreate.dto';

export async function fileCreateUsecase(dto: DTO<FileCreateDto>): Promise<Result<FileCreateResponseDto, HttpError | GuardError | RepoError>> {
    const guardRes = Result.all(validateFileType(dto.data.type), validateFileHash(dto.data.hash), validateFileBucket(dto.data.bucket));

    if (!guardRes.ok) return Err(guardRes.val);

    const res = await fileRepo.insert({
        transaction: dto.repo?.transaction,
        values: {
            type: guardRes.val[0],
            hash: guardRes.val[1],
            bucket: guardRes.val[2],
        },
    });

    if (!res.ok) return Err(res.val);

    return Ok<FileCreateResponseDto>({
        insertId: res.val[0].insertId,
        message: 'File table created successfully',
    });
}
