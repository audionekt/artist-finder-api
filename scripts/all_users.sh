#!/usr/bin/env fish
psql --host=127.0.0.1 --port=5432 --dbname=$DB_NAME --username=$DB_USER -a -f ./sql/all_users.sql
exit