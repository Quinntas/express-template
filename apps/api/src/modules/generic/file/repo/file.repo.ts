import {Repo, RepoConfig} from '../../../../lib/repo';
import {File} from '../domain/file';
import {fileTable} from '../infra/database/file.table';

export class FileRepo extends Repo<File, typeof fileTable> {
    constructor(cfg: RepoConfig<File>) {
        super(cfg);
    }
}
