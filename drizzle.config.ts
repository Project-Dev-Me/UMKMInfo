
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:SceR4Ca46pgM$yf@db.vpqjytpuudiqxrzeshuv.supabase.co:5432/postgres';

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
