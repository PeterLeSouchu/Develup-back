BEGIN;

DROP TABLE IF EXISTS "user" CASCADE;

DROP TABLE IF EXISTS "project" CASCADE;

DROP TABLE IF EXISTS "techno" CASCADE;

DROP TABLE IF EXISTS "project_techno" CASCADE;

DROP TABLE IF EXISTS "user_techno" CASCADE;

DROP TABLE IF EXISTS "conversation" CASCADE;

DROP TABLE IF EXISTS "message" CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "type" TEXT,
    "description" TEXT,
    "image" TEXT,
    "image_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "project" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "rhythm" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "image_id" TEXT,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "techno" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

-- Tables de liaison
CREATE TABLE "user_techno" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "techno_id" INTEGER NOT NULL REFERENCES "techno" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "project_techno" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "project_id" UUID NOT NULL REFERENCES "project" ("id") ON DELETE CASCADE,
    "techno_id" INTEGER NOT NULL REFERENCES "techno" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "conversation" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "user_id1" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "user_id2" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "message" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "conversation_id" UUID REFERENCES conversation(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

COMMIT;