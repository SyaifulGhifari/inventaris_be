import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";
import * as schema from "../db/schema";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 5,
    connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

export const db = drizzle(pool, { schema });

export async function testConnection(): Promise<boolean> {
    try {
        const client = await pool.connect();
        await client.query("SELECT NOW()");
        client.release();
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}
