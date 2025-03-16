ALTER TABLE "bookings" RENAME COLUMN "booking_date" TO "booking_date_start";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booking_date_end" text NOT NULL;