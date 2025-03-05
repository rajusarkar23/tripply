ALTER TABLE "tour" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tour" DROP COLUMN "overview";--> statement-breakpoint
ALTER TABLE "tour" DROP COLUMN "what_to_expect";--> statement-breakpoint
ALTER TABLE "tour" DROP COLUMN "activities";