export function mapperTemplate(name: string): string {
    const domainName = name.charAt(0).toUpperCase() + name.slice(1);
    const exportName = name.charAt(0).toLowerCase() + name.slice(1);

    return `import {${domainName}} from "../domain/${exportName}";
import {BaseMapper} from "../../../core/baseMapper";
import {InternalError} from "../../../core/errors";

export class ${domainName}Mapper extends BaseMapper<${domainName}> {
    toPublicDomain(${name.toLowerCase()}: ${domainName}): Partial<${domainName}> {
        return {
            id: ${name.toLowerCase()}.id,
            pid: ${name.toLowerCase()}.pid,
            createdAt: ${name.toLowerCase()}.createdAt,
            updatedAt: ${name.toLowerCase()}.updatedAt,
        }
    }

    toDomain(raw: any): Required<${domainName}> {
        if (!raw) throw new InternalError("Invalid input");
        if (raw.id === undefined) throw new InternalError("Invalid input")
        if (raw.pid === undefined) throw new InternalError("Invalid input")
        if (raw.createdAt === undefined) throw new InternalError("Invalid input")
        if (raw.updatedAt === undefined) throw new InternalError("Invalid input")
        return raw as Required<${domainName}>;
    }
}

export const ${exportName}Mapper = new ${domainName}Mapper();
    `;
}
