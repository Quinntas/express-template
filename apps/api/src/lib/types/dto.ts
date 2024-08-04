import {Transaction} from '../repo';

export interface DTO<Data extends object | null = null> {
    data: Partial<Data>;
    repo?: {
        transaction?: Transaction;
    };
}
