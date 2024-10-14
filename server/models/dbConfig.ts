// configuratin file for knex cli tool
import "dotenv/config";
import type { Knex } from "knex";

const knexDbConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: "time_climb",
  },
  pool: { min: 2, max: 10 }, // can be optimized later, these are default values
};

export default knexDbConfig;
