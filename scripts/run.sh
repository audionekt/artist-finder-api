#!/usr/bin/env fish
set args $argv
echo running $argv.sql, hang tight..
psql --host=127.0.0.1 --port=5432 --dbname=$DB_NAME --username=$DB_USER -a -f $argv.sql
exit
