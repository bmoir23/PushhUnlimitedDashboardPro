-- Initial schema for the Pushh application
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "auth_id" TEXT UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "username" TEXT UNIQUE,
  "picture" TEXT,
  "roles" TEXT[] NOT NULL DEFAULT '{"free"}',
  "plan" TEXT NOT NULL DEFAULT 'free',
  "status" TEXT NOT NULL DEFAULT 'active',
  "metadata" JSONB DEFAULT '{}',
  "last_login" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "metadata" JSONB DEFAULT '{}',
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "integrations" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "config" JSONB DEFAULT '{}',
  "status" TEXT NOT NULL DEFAULT 'connected',
  "last_synced" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);