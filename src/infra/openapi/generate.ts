import fs from 'node:fs';
import {openapiAppSchema} from './openapiAppSchema';

fs.createWriteStream('openapi.json').write(JSON.stringify(openapiAppSchema, null, 2));
