import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const barcodes = pgTable("barcodes", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  sku: text("sku").notNull(),
  batchNo: text("batch_no"),
  category: text("category"),
  format: text("format"),
  generatedId: text("generated_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("Unprinted"),
});
