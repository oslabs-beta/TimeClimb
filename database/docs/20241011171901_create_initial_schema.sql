
-- up method sql output
create table "step_functions" (
  "step_function_id" serial primary key, 
  "name" varchar(80) not null, 
  "arn" varchar(2048) not null, 
  "region" varchar(80) not null, 
  "type" varchar(10) not null, 
  "definition" json not null, 
  "description" varchar(256), 
  "comment" text, 
  "has_versions" boolean not null default '0', 
  "is_version" boolean not null default '0', 
  "revisionId" varchar(32) not null, 
  "parent_id" integer);

alter table "step_functions" add constraint "step_functions_parent_id_foreign" 
  foreign key ("parent_id") 
  references "step_functions" ("step_function_id") 
    on delete CASCADE;

create table "step_function_aliases" (
  "alias_id" serial primary key, 
  "name" varchar(80) not null, 
  "arn" varchar(2048) not null, 
  "region" varchar(80) not null, 
  "description" varchar(256));

create table "alias_routes" (
  "alias_id" integer not null, 
  "step_function_id" integer not null, 
  "weight" smallint not null, constraint 
  "alias_routes_pkey" 
    primary key ("alias_id", "step_function_id"));
    
alter table "alias_routes" add constraint "alias_routes_alias_id_foreign" 
  foreign key ("alias_id") 
  references "step_function_aliases" ("alias_id") 
    on delete CASCADE;

alter table "alias_routes" 
  add constraint "alias_routes_step_function_id_foreign" 
  foreign key ("step_function_id") 
  references "step_functions" ("step_function_id") 
    on delete CASCADE;

create table "steps" (
  "step_id" serial primary key, 
  "step_function_id" integer not null, 
  "name" text not null, 
  "type" varchar(20) not null, 
  "comment" text);

alter table "steps" add constraint "steps_step_function_id_foreign" 
  foreign key ("step_function_id") 
  references "step_functions" ("step_function_id") 
    on delete CASCADE;

create table "step_latencies" (
  "latency_id" bigserial primary key, 
  "step_id" integer not null, "average" double precision not null, 
  "executions" bigint not null, 
  "start_time" timestamptz not null, 
  "end_time" timestamptz not null);

alter table "step_latencies" add constraint "step_latencies_step_id_foreign" 
  foreign key ("step_id") 
  references "steps" ("step_id") 
    on delete CASCADE;

create table "step_function_latencies" (
  "latency_id" bigserial primary key, 
  "step_function_id" integer not null, 
  "average" double precision not null, 
  "executions" bigint not null, 
  "start_time" timestamptz not null, 
  "end_time" timestamptz not null);

alter table "step_function_latencies" 
  add constraint "step_function_latencies_step_function_id_foreign" 
    foreign key ("step_function_id") 
    references "step_functions" ("step_function_id") 
      on delete CASCADE;

create table "step_function_monitoring" (
  "monitor_id" serial primary key, 
  "step_function_id" integer not null, 
  "newest_update" timestamptz, 
  "oldest_update" timestamptz, 
  "start_time" timestamptz, 
  "end_time" timestamptz, 
  "active" boolean not null);

alter table "step_function_monitoring" 
  add constraint "step_function_monitoring_step_function_id_foreign" 
  foreign key ("step_function_id") 
  references "step_functions" ("step_function_id") 
    on delete CASCADE;

-- down method sql output
drop table if exists "alias_routes"
drop table if exists "step_function_aliases"
drop table if exists "step_function_monitoring"
drop table if exists "step_function_latencies"
drop table if exists "step_latencies"
drop table if exists "steps"
drop table if exists "step_functions";