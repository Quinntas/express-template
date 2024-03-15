require("dotenv").config();

import {defineConfig} from 'drizzle-kit'

export default defineConfig({
    schema: "./src/modules/shared/infra/database/schema.ts",
    driver: 'mysql2',
    dbCredentials: {
        uri: process.env.DATABASE_URL!
    },
    out: "./drizzle",
    verbose: true,
    strict: true,
})