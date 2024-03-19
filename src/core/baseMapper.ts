import {BaseDomain} from "./baseDomain";

export interface IMapper<Domain extends BaseDomain> {
    toDomain: (raw: object) => Required<Domain>
    toPublicDomain: (data: Domain) => Partial<Domain>
}

export abstract class BaseMapper<Domain extends BaseDomain> implements IMapper<Domain> {
    abstract toDomain(raw: object): Required<Domain>

    abstract toPublicDomain(data: Domain): Partial<Domain>

    toDomainList(data: Domain[]): Domain[] {
        return data.map(raw => this.toDomain(raw));
    }

    toPublicDomainList(data: Domain[]): Partial<Domain>[] {
        return data.map(raw => this.toPublicDomain(raw));
    }
}
