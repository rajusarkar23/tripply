CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"verification_otp" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tour" ADD COLUMN "tour_category" jsonb NOT NULL;