import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

type TourPlans = {
  title?: string;
  price?: number;
  totalSlots?: number;
  description?: string;
  slotsBooked?: number;
  slotsAvailable?: number;
};

type Tours = {
  standard?: TourPlans;
  premium?: TourPlans;
};

export const tour = pgTable("tour", {
  id: serial("id").primaryKey(),
  tourName: text("tour_name").notNull(),
  tourOverView: text("tour_overview").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  tourCategory: jsonb("tour_category").$type<Tours>().notNull(),
  tourPrimaryImage: text("tour_primary_image").notNull(),
  createdBy: integer("created_by")
    .references(() => admin.id)
    .notNull(),
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
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const tourists = pgTable("tourists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  verificationOTP: text("verification_otp").notNull(),
  isVerified: boolean("is_verfied").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull().default(0),
  ratingFor: integer("rating_for")
    .notNull()
    .references(() => tour.id),
  ratingBy: text("rating_by").notNull(), // name of the user
  ratingUserId: integer("rating_user_id") // id of the user
    .notNull()
    .references(() => tourists.id),

  ratingTexts: text("rating_texts").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingFor: integer("booking_for")
    .notNull()
    .references(() => tour.id),
  bookingBy: integer("booking_by")
    .notNull()
    .references(() => tourists.id),
  bookingCategory: text("booking_category").notNull(),
  bookingDateStart: text("booking_date_start").notNull(),
  bookingDateEnd: text("booking_date_end").notNull(),
  totalTouristCount: integer("total_tourist_count").notNull(),
  bookingCost: integer("booking_cost").notNull(),
  isPaymentDone: boolean("is_payment_done").notNull().default(false),
  isBookingSuccess: boolean("is_booking_success").notNull().default(false),
  paymentId: text("payment_id"),
  paymentSessionId: text("payment_session_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
