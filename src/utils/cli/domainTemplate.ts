export function domainTemplate(name: string): string {
    const domainName = name.charAt(0).toUpperCase() + name.slice(1);

    return `import {BaseDomain} from "../../../core/baseDomain"; 

export interface ${domainName} extends BaseDomain {
}
    `;
}
