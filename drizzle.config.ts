import {config} from "dotenv"
import { defineConfig } from 'drizzle-kit';


config({path: ".env"})

export default defineConfig({
    schema: './src/lib/schema/schema.ts',
    out: './src/supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});