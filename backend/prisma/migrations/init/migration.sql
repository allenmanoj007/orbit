-- ============================================================
-- Orbit Database — PostGIS & Extension Init
-- This runs BEFORE Prisma migrations
-- ============================================================

-- Enable PostGIS for geospatial location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable pg_trgm for fuzzy text search (usernames, names)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PostGIS will be used via raw Prisma queries for:
-- ST_DWithin  → nearby user queries (radius search)
-- ST_Distance → distance between users
-- ST_MakePoint → create geography point from lat/lng
-- All stored as GEOGRAPHY(Point, 4326) for meter-based accuracy
-- ============================================================
