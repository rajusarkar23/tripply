import { boolean, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
  tourOverView: text("tour_overview"),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  tourCategory: jsonb("tour_category").$type<Tours>().notNull(),
  tourPrimaryImage: text("tour_primary_image"),
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
  isVerified: boolean("is_verfied").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull()
});
