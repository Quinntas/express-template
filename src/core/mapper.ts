import {Ok, Result} from 'ts-results';
import {map} from '../utils/iterators';
import {MapperError} from './errors';
import {Domain as DomainType} from './types/domain';
import {UnknownObject} from './types/json';

/**
 * BaseMapper class is an abstract class that provides basic mapping functionality for converting
 * raw objects to domain objects and vice versa.
 * @typeparam Domain - The domain object type that this mapper will be converting to/from.
 */
export abstract class Mapper<Domain extends DomainType<any>> implements Mapper<Domain> {
    abstract toDomain(raw: object): Result<Required<Domain>, MapperError>;

    /**
     * Converts the provided data to public domain format.
     *
     * @param {Domain} data - The original data to be converted to public domain.
     * @return {Partial<Domain>} - The converted data in public domain format.
     */
    abstract toPublicDomain(data: Domain): Result<Partial<Domain>, MapperError>;

    /**
     * Converts an array of raw data objects to an array of Domain objects.
     *
     * @param {any[]} data - The array of raw data objects to be converted.
     * @return {Domain[]} - The array of converted Domain objects.
     */
    rawToDomainList<T extends UnknownObject[]>(data: T): Result<Domain[], MapperError> {
        return Ok(
            map(data, (raw) => {
                return this.toDomain(raw).unwrap();
            }),
        );
    }

    /**
     * Converts an array of raw data objects to an array of domain objects.
     *
     * @param {Domain[]} data - The array of raw data objects to be converted.
     * @return {Domain[]} - The array of domain objects.
     */
    toDomainList(data: Domain[]): Result<Domain[], MapperError> {
        return Ok(
            map(data, (raw) => {
                return this.toDomain(raw).unwrap();
            }),
        );
    }

    /**
     * Converts an array of Domain objects to an array of Partial<Domain> objects.
     *
     * @param {Domain[]} data - The input array of Domain objects.
     *
     * @return {Partial<Domain>[]} - The converted array of Partial<Domain> objects.
     */
    toPublicDomainList(data: Domain[]): Result<Partial<Domain>[], MapperError> {
        return Ok(
            map(data, (raw) => {
                return this.toPublicDomain(raw).unwrap();
            }),
        );
    }
}
