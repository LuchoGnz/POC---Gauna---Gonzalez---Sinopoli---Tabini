import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const phonesTable = pgTable("phones", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  stock: integer().notNull(),
  empresa : varchar({ length: 255 }).notNull().default('Sin empresa'),
})

export const empresasTable = pgTable("empresas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

export type phonesInsert = typeof phonesTable.$inferInsert;
export type empresasInsert = typeof empresasTable.$inferInsert;

export const schema = { phonesTable };
export const schemaEmpresas = { empresasTable };