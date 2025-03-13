CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"verification_otp" text NOT NULL,
	"is_verfied" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"rating_for" integer NOT NULL,
	"rating_by" text NOT NULL,
	"rating_user_id" integer NOT NULL,
	"rating_texts" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tour" (
	"id" serial PRIMARY KEY NOT NULL,
	"tour_name" text NOT NULL,
	"tour_overview" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"tour_category" jsonb NOT NULL,
	"tour_primary_image" text NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tourists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"verification_otp" text NOT NULL,
	"is_verfied" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rating_for_tour_id_fk" FOREIGN KEY ("rating_for") REFERENCES "public"."tour"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rating_user_id_tourists_id_fk" FOREIGN KEY ("rating_user_id") REFERENCES "public"."tourists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour" ADD CONSTRAINT "tour_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE no action ON UPDATE no action;