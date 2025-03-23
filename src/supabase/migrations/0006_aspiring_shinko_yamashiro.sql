ALTER TABLE "bookings" DROP CONSTRAINT "bookings_booking_for_tour_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_booking_by_tourists_id_fk";
--> statement-breakpoint
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_rating_for_tour_id_fk";
--> statement-breakpoint
ALTER TABLE "tour" DROP CONSTRAINT "tour_created_by_admin_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_for_tour_id_fk" FOREIGN KEY ("booking_for") REFERENCES "public"."tour"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_by_tourists_id_fk" FOREIGN KEY ("booking_by") REFERENCES "public"."tourists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rating_for_tour_id_fk" FOREIGN KEY ("rating_for") REFERENCES "public"."tour"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour" ADD CONSTRAINT "tour_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;