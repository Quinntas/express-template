import {Err} from 'ts-results';
import {MapperError} from '../../../../lib/errors';
import {Mapper} from '../../../../lib/mapper';
import {File} from '../domain/file';

export class FileMapper extends Mapper<File> {
    toPublicDomain(_domain: File) {
        return Err(new MapperError('could not convert domain to public domain'));
    }

    toDomain(_raw: any) {
        return Err(new MapperError('could not convert domain to public domain'));
    }
}
