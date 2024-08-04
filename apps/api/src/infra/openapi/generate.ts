import fs from 'node:fs';
import {schemaOpenapi} from './schema.openapi';

fs.createWriteStream('openapi.json').write(
    JSON.stringify(schemaOpenapi, null, 2),
);
