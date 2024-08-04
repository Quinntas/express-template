import {Result} from 'ts-results';
import {DTO} from './dto';

export type UseCaseFunction<T extends object, R extends object> = (dto: DTO<T>, ...args: any[]) => Promise<Result<R, Error>>;
