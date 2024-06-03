import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Define the users table
export const $users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // Use UUID for id
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Define the tasks table
export const $tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  finish: boolean("finish").notNull(),
  desc: text("desc"),
  authorId: uuid("author_id").references(() => $users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deadline: timestamp("deadline").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Define relations for the users table
export const usersRelations = relations($users, ({ many }) => ({
  $tasks: many($tasks), // Add the relation for tasks
}));

// Define relations for the tasks table
export const tasksRelations = relations($tasks, ({ one }) => ({
  author: one($users, {
    fields: [$tasks.authorId],
    references: [$users.id],
  }),
}));

export type UserType = typeof $users.$inferInsert;
export type TaskType = typeof $tasks.$inferInsert;
