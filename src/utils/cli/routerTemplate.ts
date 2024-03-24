export function routerTemplate(name: string): string {
    const exportName = name.charAt(0).toLowerCase() + name.slice(1);

    return `import {Router} from "express";

export const ${exportName}Router: Router = Router();
    `
}