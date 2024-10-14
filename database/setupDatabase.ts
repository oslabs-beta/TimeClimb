import "dotenv/config";
import pg from "pg";
const { Client } = pg;

async function setupDatabase() {
  console.log("hello");
  const client = new Client({
    database: "postgres",
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  try {
    const query = "SELECT 1 FROM pg_database WHERE datname = 'time_climb';";
    const result = await client.query(query);
    console.log("rowCount", result.rowCount);
    // if no results create the database
    if (result.rowCount === 0) {
      console.log("Creating database");
      await client.query(
        `CREATE DATABASE time_climb2
          WITH
            OWNER = postgres
            ENCODING = 'UTF8'
            LC_COLLATE = 'C'
            LC_CTYPE = 'C'
            LOCALE_PROVIDER = 'libc'
            TABLESPACE = pg_default
            CONNECTION LIMIT = -1
            IS_TEMPLATE = False;`
      );
      console.log("Database created");
    } else {
      console.log("Database already created");
    }
  } catch (err) {
    console.log(`Error setting up database: ${err}`);
  } finally {
    await client.end();
  }
}

setupDatabase();
