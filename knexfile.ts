import "dotenv/config";
import type { Knex } from "knex";

const knexConfig: Knex.Config = {
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
};

export default knexConfig;
