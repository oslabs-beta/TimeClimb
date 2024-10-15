// file for connecting to postgres with knex / pg
// then exporting that connection where necessary
import knex from "knex";
import knexDbConfig from "./dbConfig";

const db = knex(knexDbConfig);

export default db;
