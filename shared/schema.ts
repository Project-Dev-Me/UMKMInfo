import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const umkmBusinesses = pgTable("umkm_businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'makanan', 'fashion', 'jasa', 'kerajinan'
  description: text("description"),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  image: text("image").notNull(),
  featuredImage: text("featured_image"),
  status: text("status").default("active"), // 'active', 'new', 'featured'
  isNewlyJoined: boolean("is_newly_joined").default(false),
  location: text("location"),
  contact: text("contact"),
  isPopular: boolean("is_popular").default(false),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessId: integer("business_id").references(() => umkmBusinesses.id),
});

export const insertUmkmBusinessSchema = createInsertSchema(umkmBusinesses).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
});

export type InsertUmkmBusiness = z.infer<typeof insertUmkmBusinessSchema>;
export type UmkmBusiness = typeof umkmBusinesses.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
