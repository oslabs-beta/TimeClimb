
-- up method sql output
create table "step_functions" (
  "step_function_id" serial primary key, 
  "name" varchar(80) not null, 
  "arn" varchar(2048) not null, 
  "region" varchar(80) not null, 
  "type" varchar(10) not null, 
  "alias" varchar(80), 
  "asl" json not null, 
  "description" varchar(256), 
  "comment" text, 
  "has_versions" boolean not null, 
  "parent_id" integer);

alter table "step_functions" add constraint 
  "step_functions_parent_id_foreign" 
  foreign key ("parent_id") 
  references "step_functions" ("step_function_id");


-- down method sql output
drop table if exists "step_functions"