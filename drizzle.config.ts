// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_vgE4xT0SVRWk@ep-shy-brook-a80db2rj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  },
});
