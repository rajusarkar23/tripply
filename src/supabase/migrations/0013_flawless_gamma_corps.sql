ALTER TABLE "bookings" DROP CONSTRAINT "bookings_booking_for_tour_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_for_tourV2_id_fk" FOREIGN KEY ("booking_for") REFERENCES "public"."tourV2"("id") ON DELETE cascade ON UPDATE no action;