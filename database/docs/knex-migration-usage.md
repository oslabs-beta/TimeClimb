# Knex Migrations

https://knexjs.org/

Knex helps to document and automate database schema changes and data migrations over time.

## Getting Started

### Creating and Updating the database time_climb

<ol>
  <li>Create an .env file in the root folder directory.  Make sure it is ignored by
git.
  </li>
  <li>Add the following environment variables to .env:
    <ul>
      <li><code>PGHOST='localhost'</code> (whatever address postgres is listening on)</li>
      <li><code>PGPORT='5432'</code> (whatever port postgres is listening on)</li>
      <li><code>PGUSER='postgres'</code> (whatever your username is)</li>
      <li><code>PGPASSWORD='your_users_password'</code></li>
    </ul>
  </li>
<li><code>npm run setup:database</code> to create the initial database called `time_climb`.
</li>
<li><code>npm run migrate:latest</code> to update the database with the latest schema.
</ol>

## Knex Detailed Usage

Convience scripts are set up in package.json to run common knex migration functions.

- `npm run migrate:make` Creating a migration with npm run migate:make
- `npm run migrate:latest` Updating the database with the latest schema changes
- `npm run migrate:rollback` Rolling back a change to the database

These are partially necessary because both the configuration files and migrations are written in TypeScript. Knex's command line tool does not natively support TypeScript. The need for these tools might become unnecessary with proper TypeScript configuration.

### Creating a migration

Creating a new migration will place a new file in /database/migrations

You can pass the name of the file after the script like so:

`npm run migrate:make -- your_migration_file_name`

### Updatating the database to the latest schema changes

`npm run migrate:latest`

This will update the database with latest schema changes. If necessary its possible to also migrate data so that it data is not lost, which might be especially helpful in a production environment.

### Rolling back a migration

`npm run migrate:rollback`

This will roll back only the very latest migration unit. You can pass in an argument `--all` to rollback all of the completed migrations this way:

`npm run migrate:rollback -- --all`
