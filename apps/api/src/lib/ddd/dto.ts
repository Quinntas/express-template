import {DeepPartial} from '../../utils/types';
import {Transaction} from './repo';

export interface DTO<Data extends object | null = null> {
    data: DeepPartial<Data>;
    repo?: {
        transaction?: Transaction;
    };
}
