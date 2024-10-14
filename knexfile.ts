// configuratin file for knex cli tool
import "dotenv/config";
import type { Knex } from "knex";

const development: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./database/seeds",
  },
  pool: { min: 2, max: 10 }, // can be optimized later, these are default values
  debug: true,
};

const production: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
  pool: { min: 2, max: 10 }, // can be optimized later, these are default values
  debug: false,
};

const knexCliConfig: { [key: string]: Knex.Config } = {
  development,
  production,
};
export default knexCliConfig;
