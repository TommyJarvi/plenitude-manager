import { db } from "./db";
import { users, students, workouts, challenges, type User, type Student, type Workout, type Challenge } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  
  // students
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  createStudent(student: any): Promise<Student>;
  updateStudent(id: number, updates: any): Promise<Student>;
  
  // workouts
  getWorkouts(): Promise<Workout[]>;
  getWorkoutsByStudentId(studentId: number): Promise<Workout[]>;
  createWorkout(workout: any): Promise<Workout>;

  // challenges
  getChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: any): Promise<Challenge>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(user: any): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }
  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }
  async createStudent(student: any): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }
  async updateStudent(id: number, updates: any): Promise<Student> {
    const [updated] = await db.update(students).set(updates).where(eq(students.id, id)).returning();
    return updated;
  }
  
  async getWorkouts(): Promise<Workout[]> {
    return await db.select().from(workouts);
  }
  async getWorkoutsByStudentId(studentId: number): Promise<Workout[]> {
    return await db.select().from(workouts).where(eq(workouts.studentId, studentId));
  }
  async createWorkout(workout: any): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }
  
  async getChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges);
  }
  async createChallenge(challenge: any): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }
}

export const storage = new DatabaseStorage();
