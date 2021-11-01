#!/usr/bin/env fish
psql --host=127.0.0.1 --port=5432 --dbname=$DB_NAME --username=$DB_USER -a -f ./sql/drop_tables.sql
exit