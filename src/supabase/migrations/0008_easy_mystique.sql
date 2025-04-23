CREATE TABLE "tourV2" (
	"id" serial PRIMARY KEY NOT NULL,
	"main_back_image" text NOT NULL,
	"slug" text NOT NULL,
	"hero_banner_content" jsonb NOT NULL,
	"things_to_do_arr" jsonb NOT NULL,
	"visit_timings" jsonb NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tourV2" ADD CONSTRAINT "tourV2_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;