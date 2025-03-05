import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/schema/schema.ts',
    out: './src/supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});