import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  let sql = await knex.schema
    .createTable("step_functions", (table) => {
      table.increments("step_function_id").notNullable();
      table.string("name", 80).notNullable();
      table.string("arn", 2048).notNullable();
      table.string("region", 80).notNullable();
      table.string("type", 10).notNullable();
      table.string("alias", 80);
      table.json("asl").notNullable();
      table.string("description", 256);
      table.text("comment");
      table.boolean("has_versions").notNullable();
      table.integer("parent_id");
      table
        .foreign("parent_id")
        .references("step_function_id")
        .inTable("step_functions");
    })
    .toSQL();
  console.log("create step_functions", sql);
}

export async function down(knex: Knex): Promise<void> {
  const sql = await knex.schema.dropTableIfExists("step_functions").toSQL();
  console.log("drop sql:", sql);
  // await knex.schema.dropTableIfExists("step_functions");
  // await knex.schema.dropTableIfExists("step_functions");
}
