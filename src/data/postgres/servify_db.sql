CREATE TYPE "order_status" AS ENUM (
  'process',
  'complete'
);

CREATE TYPE "role" AS ENUM (
  'client',
  'provider'
);

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" varchar NOT NULL,
  "lastname" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "image" varchar,
  "email_validated" bool DEFAULT false,
  "is_active" bool DEFAULT true,
  "role" role DEFAULT 'client',
  "created_at" timestamp DEFAULT 'now()',
  "updated_at" timestamp
);

CREATE TABLE "client" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid,
  "phone" varchar,
  "address" varchar,
  "zip_code" varchar
);

CREATE TABLE "provider" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid,
  "phone" varchar NOT NULL,
  "description" text,
  "rating" int,
  "content" text
);

CREATE TABLE "availability" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "provider_id" uuid,
  "busy_at" timestamp NOT NULL
);

CREATE TABLE "experience" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "provider_id" uuid,
  "title" varchar NOT NULL,
  "plaace" varchar NOT NULL,
  "description" text,
  "start_time" timestamp,
  "end_time" timestamp
);

CREATE TABLE "service" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "category_service_id" uuid,
  "name" varchar NOT NULL,
  "description" text NOT NULL,
  "content" text,
  "price_by_hour" decimal NOT NULL
);

CREATE TABLE "service_image" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "service_id" uuid,
  "url" varchar NOT NULL
);

CREATE TABLE "category" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" varchar NOT NULL,
  "description" text
);

CREATE TABLE "service_provider" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "service_id" uuid,
  "provider_id" uuid
);

CREATE TABLE "order" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "client_id" uuid,
  "service_id" uuid,
  "start_date" timestamp NOT NULL,
  "end_date" timestamp NOT NULL,
  "price" decimal,
  "status" order_status NOT NULL,
  "created_at" timestamp DEFAULT 'now()',
  "updated_at" timestamp
);

CREATE TABLE "review" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "order_id" uuid,
  "rating" int NOT NULL,
  "comment" varchar NOT NULL,
  "created_at" timestamp DEFAULT 'now()',
  "updated_at" timestamp
);

CREATE UNIQUE INDEX ON "client" ("address");

CREATE INDEX ON "experience" ("title");

CREATE UNIQUE INDEX ON "service_image" ("url");

ALTER TABLE "client" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "provider" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "service" ADD FOREIGN KEY ("category_service_id") REFERENCES "category" ("id");

ALTER TABLE "service_provider" ADD FOREIGN KEY ("service_id") REFERENCES "service" ("id");

ALTER TABLE "service_provider" ADD FOREIGN KEY ("provider_id") REFERENCES "provider" ("id");

ALTER TABLE "experience" ADD FOREIGN KEY ("provider_id") REFERENCES "provider" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("client_id") REFERENCES "client" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("service_id") REFERENCES "service" ("id");

ALTER TABLE "review" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "service_image" ADD FOREIGN KEY ("service_id") REFERENCES "service" ("id");

ALTER TABLE "availability" ADD FOREIGN KEY ("provider_id") REFERENCES "provider" ("id");
