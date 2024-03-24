export function repoTemplate(name: string): string {
    const domainName = name.charAt(0).toUpperCase() + name.slice(1);
    const exportName = name.charAt(0).toLowerCase() + name.slice(1);

    return `import {${domainName}} from "../domain/${exportName}";
import {db} from "../../../infra/database/mysql";
import {${exportName}Table} from "../infra/database/${exportName}Table";
import {BaseRepo} from "../../../core/baseRepo";
import {${exportName}Mapper} from "../mapper/${exportName}Mapper";

export class ${domainName}Repo extends BaseRepo<${domainName}> {
    constructor() {
        super(${exportName}Table, db, ${exportName}Mapper)
    }
}

export const ${exportName}Repo = new ${domainName}Repo()
    `;
}
