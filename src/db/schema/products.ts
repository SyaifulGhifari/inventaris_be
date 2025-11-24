import { pgTable, uuid, varchar, integer, numeric, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Products table schema
 * Stores textile product information with sizes, colors, materials
 */
export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(), // Celana, Celana Jeans, Baju, Jaket
    sizes: jsonb('sizes').notNull().$type<string[]>(), // Array of sizes: ["S", "M", "L", "XL"]
    color: varchar('color', { length: 50 }).notNull(),
    material: varchar('material', { length: 100 }).notNull(),
    stock: integer('stock').notNull().default(0),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    imageUrl: varchar('image_url', { length: 500 }),
    createdBy: uuid('created_by').references(() => users.id),
    updatedBy: uuid('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
