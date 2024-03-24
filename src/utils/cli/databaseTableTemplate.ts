export function databaseTableTemplate(name: string): string {
    const exportName = name.charAt(0).toLowerCase() + name.slice(1);

    return `import {dbSchema} from "../../../shared/infra/database/schema";
import {baseColumns} from "../../../shared/infra/database/baseColumns";

export const ${exportName}Table = dbSchema.table("", {
    ...baseColumns,
})`;
}
