import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

// async function setupDatabase() {
  const client = new Client({
    database: 'postgres',
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
  try {
    await client.connect();

    const query = "SELECT 1 FROM pg_database WHERE datname = 'time_climb';";
    const result = await client.query(query);

    // if no results create the database
    if (result.rowCount === 0) {
      console.log(`Creating database: time_climb`);
      await client.query(
        //LOCALE_PROVIDER = 'libc'
        /*ENCODING = 'UTF8'
            LC_COLLATE = 'C'
            LC_CTYPE = 'C'*/
        `CREATE DATABASE time_climb
          WITH
            TABLESPACE = pg_default
            IS_TEMPLATE = False;`
      );
      console.log('Database created');
    } else {
      console.log(`Database time_climb already exists`);
    }
  } catch (err) {
    console.log(`Error setting up database time_climb: ${err}`);
  } finally {
    await client.end();
  }
}

setupDatabase();
