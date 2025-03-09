import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

type TourPlans = {
    title: string,
    price: number,
    totalSlots: number,
    slotsBooked: number,
    slotsAvailable: number
}

type Tours = {
    standard: TourPlans,
    premium: TourPlans
}

export const tour =pgTable("tour", {
    id: serial("id").primaryKey(),
    tourName: text("tour_name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    tourCategory: jsonb("tour_category").$type<Tours>(),
    // createdBy:
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})