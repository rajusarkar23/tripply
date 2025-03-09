import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

type TourPlans = {
  title: string;
  price: number;
  totalSlots: number;
  description: string;
  slotsBooked: number;
  slotsAvailable: number;
};

type Tours = {
  standard: TourPlans;
  premium: TourPlans;
};

export const tour = pgTable("tour", {
  id: serial("id").primaryKey(),
  tourName: text("tour_name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  tourCategory: jsonb("tour_category").$type<Tours>().notNull(),
  // createdBy:
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const admin = pgTable("admin", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  verificationOTP: text("verification_otp").notNull(),
});
