import {defineConfig} from 'drizzle-kit'
import {env} from "./src/utils/env";

export default defineConfig({
    dialect: 'mysql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
})