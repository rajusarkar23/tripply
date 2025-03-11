ALTER TABLE "admin" ADD COLUMN "is_verfied" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "updated_at" timestamp NOT NULL;