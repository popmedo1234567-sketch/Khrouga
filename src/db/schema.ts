import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Khrouga — جدول الأماكن
 * نفس الشكل يتعمل في Supabase من ملف supabase/schema.sql
 */
export const places = pgTable(
  "places",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    area: text("area").notNull(),
    address: text("address").notNull(),
    type: text("type").notNull(),
    /** الأجواء اللي تناسب المكان (رومانسي / شلة / عائلي ...) */
    moods: text("moods").array().notNull().default([]),
    /** تاجات سريعة بتظهر على الكارت (يفتح ٢٤ ساعة / فيه ركن أطفال ...) */
    tags: text("tags").array().notNull().default([]),
    /** متوسط سعر الفرد بالجنيه */
    avgPrice: integer("avg_price").notNull().default(0),
    /** [{ name, price, note? }] */
    menuItems: jsonb("menu_items").$type<{ name: string; price: number; note?: string }[]>().notNull().default([]),
    imageUrl: text("image_url"),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    reelUrl: text("reel_url"),
    whatsapp: text("whatsapp"),
    mapsUrl: text("maps_url"),
    rating: real("rating").notNull().default(0),
    hours: text("hours"),
    notes: text("notes"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [index("places_area_idx").on(t.area), index("places_type_idx").on(t.type), index("places_price_idx").on(t.avgPrice)],
);

export type PlaceRow = typeof places.$inferSelect;
export type NewPlaceRow = typeof places.$inferInsert;
