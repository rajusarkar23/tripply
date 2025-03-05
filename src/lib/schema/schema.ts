import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tour =pgTable("tour", {
    id: serial("id").primaryKey(),
    tourName: text("tour_name").notNull(),
    slug: text("slug").notNull(),
    overview: text("overview").notNull(),
    whatToExpect: text("what_to_expect").notNull(),
    activities: text("activities").notNull(),
    // createdBy:
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})