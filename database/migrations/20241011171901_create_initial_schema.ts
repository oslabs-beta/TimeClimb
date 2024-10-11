import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // step_functions table
  await knex.schema.createTable("step_functions", (table) => {
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
    table.integer("parent_id").unsigned();
    table
      .foreign("parent_id")
      .references("step_function_id")
      .inTable("step_functions")
      .onDelete("CASCADE");
  });
  // steps table
  await knex.schema.createTable("steps", (table) => {
    table.increments("step_id").notNullable();
    table.integer("step_function_id").unsigned().notNullable();
    table.text("name").notNullable();
    table.string("type", 20).notNullable();
    table.text("comment");
    table
      .foreign("step_function_id")
      .references("step_function_id")
      .inTable("step_functions")
      .onDelete("CASCADE");
  });
  // step_latencies table
  await knex.schema.createTable("step_latencies", (table) => {
    table.bigIncrements("latency_id").notNullable();
    table.integer("step_id").unsigned().notNullable();
    table.double("average").notNullable();
    table.bigInteger("executions").unsigned().notNullable();
    table.timestamp("start_time", { useTz: true }).notNullable();
    table.timestamp("end_time", { useTz: true }).notNullable();
    table
      .foreign("step_id")
      .references("step_id")
      .inTable("steps")
      .onDelete("CASCADE");
  });
  // step_function_latencies table
  await knex.schema.createTable("step_function_latencies", (table) => {
    table.bigIncrements("latency_id").notNullable();
    table.integer("step_function_id").unsigned().notNullable();
    table.double("average").notNullable();
    table.bigInteger("executions").unsigned().notNullable();
    table.timestamp("start_time", { useTz: true }).notNullable();
    table.timestamp("end_time", { useTz: true }).notNullable();
    table
      .foreign("step_function_id")
      .references("step_function_id")
      .inTable("step_functions")
      .onDelete("CASCADE");
  });
  // step_function_monitoring table
  await knex.schema.createTable("step_function_monitoring", (table) => {
    table.increments("monitor_id").notNullable();
    table.integer("step_function_id").unsigned().notNullable();
    table.timestamp("newest_update", { useTz: true });
    table.timestamp("oldest_update", { useTz: true });
    table.timestamp("start_time", { useTz: true });
    table.timestamp("end_time", { useTz: true });
    table.boolean("active").notNullable();
    table
      .foreign("step_function_id")
      .references("step_function_id")
      .inTable("step_functions")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("step_function_monitoring");
  await knex.schema.dropTableIfExists("step_function_latencies");
  await knex.schema.dropTableIfExists("step_latencies");
  await knex.schema.dropTableIfExists("steps");
  await knex.schema.dropTableIfExists("step_functions");
}
