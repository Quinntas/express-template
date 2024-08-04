import {Domain} from '../../../../lib/types/domain';
import {fileTable} from '../infra/database/file.table';

export interface File extends Domain<typeof fileTable> {}
