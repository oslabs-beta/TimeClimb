-- Database: time_climb

DROP DATABASE IF EXISTS time_climb;

CREATE DATABASE time_climb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    CREATE TABLE public.step_functions
(
    step_function_id serial NOT NULL,
    name character varying(80) NOT NULL,
    arn character varying(2048) NOT NULL,
    region character varying(30) NOT NULL,
    type character varying(10) NOT NULL,
    alias character varying(80),
    asl json NOT NULL,
    description character varying(256),
    comment text,
    has_versions boolean NOT NULL,
    parent_id integer,
    PRIMARY KEY (step_function_id),
    FOREIGN KEY (parent_id) REFERENCES public.step_functions()
);

ALTER TABLE IF EXISTS public.step_functions
    OWNER to postgres;

COMMENT ON TABLE public.step_functions
    IS 'Contains all of a users step functions';