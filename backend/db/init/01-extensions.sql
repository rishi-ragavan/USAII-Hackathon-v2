-- Runs once on first DB init (postgis image executes *.sql in /docker-entrypoint-initdb.d).
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
