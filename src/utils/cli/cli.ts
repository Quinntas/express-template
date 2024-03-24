import * as fs from 'fs';
import {databaseTableTemplate} from './databaseTableTemplate';
import {domainTemplate} from './domainTemplate';
import {mapperTemplate} from './mapperTemplate';
import {repoTemplate} from './repoTemplate';
import {routerTemplate} from './routerTemplate';

function createModule(name: string | null) {
    if (!name) throw new Error('No module name provided');
    if (/\d/.test(name)) throw new Error('Module name cannot contain numbers');

    console.log(`Creating module: ${name}`);

    const moduleName = name.charAt(0).toLowerCase() + name.slice(1);

    if (fs.existsSync(`src/modules/${moduleName}`)) throw new Error(`Module ${moduleName} already exists`);

    fs.mkdirSync(`src/modules/${moduleName}`);

    console.log(`Creating module structure for ${moduleName}`);

    fs.mkdirSync(`src/modules/${moduleName}/domain`);
    const domainF = fs.createWriteStream(`src/modules/${moduleName}/domain/${moduleName}.ts`);
    domainF.write(domainTemplate(name));

    fs.mkdirSync(`src/modules/${moduleName}/domain/valueObjects`);
    fs.createWriteStream(`src/modules/${moduleName}/domain/valueObjects/.gitkeep`);

    fs.mkdirSync(`src/modules/${moduleName}/mapper`);
    const mapperF = fs.createWriteStream(`src/modules/${moduleName}/mapper/${moduleName}Mapper.ts`);
    mapperF.write(mapperTemplate(name));

    fs.mkdirSync(`src/modules/${moduleName}/repo`);
    const repoF = fs.createWriteStream(`src/modules/${moduleName}/repo/${moduleName}Repo.ts`);
    repoF.write(repoTemplate(name));

    fs.mkdirSync(`src/modules/${moduleName}/infra`);

    fs.mkdirSync(`src/modules/${moduleName}/infra/http`);
    const routerF = fs.createWriteStream(`src/modules/${moduleName}/infra/http/${moduleName}Router.ts`);
    routerF.write(routerTemplate(name));

    fs.mkdirSync(`src/modules/${moduleName}/infra/database`);
    const tableF = fs.createWriteStream(`src/modules/${moduleName}/infra/database/${moduleName}Table.ts`);
    tableF.write(databaseTableTemplate(name));

    fs.mkdirSync(`src/modules/${moduleName}/useCases`);
    fs.createWriteStream(`src/modules/${moduleName}/useCases/.gitkeep`);

    console.log(`Module ${moduleName} created successfully`);

    console.log(`[Important] Don't forget to add the table name in the repo!`);
}

function main(args: string[]) {
    if (args.length === 0) throw new Error('No arguments provided');

    switch (args[0]) {
        case 'cm':
            return createModule(args[1]);
        default:
            throw new Error(`Unknown command: ${args[0]}`);
    }
}

main(process.argv.slice(2));
