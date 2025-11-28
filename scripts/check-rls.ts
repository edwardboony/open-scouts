import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL!;

async function checkRLS() {
  const sql = postgres(DATABASE_URL);

  try {
    const result = await sql`
      SELECT
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('chat_sessions', 'chat_messages')
    `;

    console.log("RLS Status:");
    console.table(result);
  } catch (error) {
    console.error("Error checking RLS:", error);
  } finally {
    await sql.end();
  }
}

checkRLS();
