CREATE TABLE "tour" (
	"id" serial PRIMARY KEY NOT NULL,
	"tour_name" text NOT NULL,
	"slug" text NOT NULL,
	"overview" text NOT NULL,
	"what_to_expect" text NOT NULL,
	"activities" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
