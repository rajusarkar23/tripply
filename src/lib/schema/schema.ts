import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tour =pgTable("tour", {
    id: serial("id").primaryKey(),
    tourName: text("tour_name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    // createdBy:
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})