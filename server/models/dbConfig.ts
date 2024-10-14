// configuratin file for knex cli tool
import "dotenv/config";
import type { Knex } from "knex";

const knexDbConfig: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 }, // can be optimized later, these are default values
};

export default knexDbConfig;
