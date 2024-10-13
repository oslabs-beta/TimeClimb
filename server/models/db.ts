// file for connecting to postgres with knex / pg
// then exporting that connection where necessary
import knex from "knex";
import knexConfig from "../../knexfile";

const db = knex(knexConfig);

export default db;
