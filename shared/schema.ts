
import { pgTable, text, serial, integer, boolean, real, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  full_name: text("full_name").notNull(),
  phone: text("phone"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const umkmBusinesses = pgTable("umkm_businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner_id: uuid("owner_id").references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'makanan', 'fashion', 'jasa', 'kerajinan'
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  image_url: text("image_url"),
  rating: real("rating").notNull().default(0),
  review_count: integer("review_count").notNull().default(0),
  status: text("status").default("pending"), // 'pending', 'active', 'suspended'
  is_popular: boolean("is_popular").default(false),
  is_newly_joined: boolean("is_newly_joined").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  umkm_id: uuid("umkm_id").references(() => umkmBusinesses.id),
  user_id: uuid("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),
  umkm_id: uuid("umkm_id").references(() => umkmBusinesses.id),
  created_at: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUmkmBusinessSchema = createInsertSchema(umkmBusinesses).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  full_name: true,
  phone: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  created_at: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  created_at: true,
});

export type InsertUmkmBusiness = z.infer<typeof insertUmkmBusinessSchema>;
export type UmkmBusiness = typeof umkmBusinesses.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;
