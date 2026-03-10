import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Usuários do sistema (Administradores e Alunos)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Login (Telefone para alunos)
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // 'admin' ou 'student'
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  photoUrl: text("photo_url"),
  enrollmentDate: date("enrollment_date").notNull(),
  plan: text("plan").notNull(),
  dueDate: date("due_date").notNull(),
  isActive: boolean("is_active").default(true),
  points: integer("points").default(0),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: text("reward").notNull(),
  isActive: boolean("is_active").default(true),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertStudentSchema = createInsertSchema(students);
export const insertWorkoutSchema = createInsertSchema(workouts);
export const insertChallengeSchema = createInsertSchema(challenges);

// Types
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
