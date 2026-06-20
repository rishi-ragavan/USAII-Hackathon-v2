# PostGIS base (Debian/PGDG) + pgvector, so we get geospatial AND vector search.
FROM postgis/postgis:16-3.4
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-16-pgvector \
    && rm -rf /var/lib/apt/lists/*

# Executed automatically on first cluster init.
COPY init/ /docker-entrypoint-initdb.d/
