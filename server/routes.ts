import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Helper for session augmentation
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'plenitude_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using https
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) { // Em prod, usar bcrypt
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth Routes
  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) return res.status(500).json({ message: "Internal error" });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.logIn(user, async (err) => {
        if (err) return res.status(500).json({ message: "Internal error" });
        
        let student = null;
        if (user.role === 'student') {
          student = await storage.getStudentByUserId(user.id);
        }
        return res.status(200).json({ user, student });
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as any;
    let student = null;
    if (user.role === 'student') {
      student = await storage.getStudentByUserId(user.id);
    }
    return res.status(200).json({ user, student });
  });

  // Students Routes
  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getStudents();
    res.status(200).json(students);
  });

  app.get(api.students.get.path, async (req, res) => {
    const student = await storage.getStudent(Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  });

  app.post(api.students.create.path, async (req, res) => {
    try {
      const input = api.students.create.input.parse(req.body);
      
      // Criar usuário para o aluno
      const newUser = await storage.createUser({
        username: input.phone,
        password: input.phone, // Senha inicial igual ao telefone
        role: "student"
      });

      // Criar o aluno
      const newStudent = await storage.createStudent({
        ...input,
        userId: newUser.id,
        points: 0,
        isActive: true,
      });

      res.status(201).json(newStudent);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.put(api.students.update.path, async (req, res) => {
    try {
      const input = api.students.update.input.parse(req.body);
      const updated = await storage.updateStudent(Number(req.params.id), input);
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.post(api.students.renew.path, async (req, res) => {
    const student = await storage.getStudent(Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Not found" });
    
    // Add 30 days to due date
    const newDueDate = new Date(student.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 30);
    
    const updated = await storage.updateStudent(student.id, { dueDate: newDueDate.toISOString().split('T')[0] });
    res.status(200).json(updated);
  });

  app.post(api.students.deactivate.path, async (req, res) => {
    const student = await storage.getStudent(Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Not found" });
    
    const updated = await storage.updateStudent(student.id, { isActive: false });
    res.status(200).json(updated);
  });

  // Workouts Routes
  app.get(api.workouts.list.path, async (req, res) => {
    const workouts = await storage.getWorkouts();
    res.status(200).json(workouts);
  });

  app.post(api.workouts.create.path, async (req, res) => {
    try {
      const input = api.workouts.create.input.parse(req.body);
      const newWorkout = await storage.createWorkout({ studentId: input.studentId });
      
      // Adicionar pontos ao aluno (10 pontos por treino)
      const student = await storage.getStudent(input.studentId);
      if (student) {
        await storage.updateStudent(student.id, { points: (student.points || 0) + 10 });
      }

      res.status(201).json(newWorkout);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  // Challenges Routes
  app.get(api.challenges.list.path, async (req, res) => {
    const challenges = await storage.getChallenges();
    res.status(200).json(challenges);
  });

  app.post(api.challenges.create.path, async (req, res) => {
    try {
      const input = api.challenges.create.input.parse(req.body);
      const newChallenge = await storage.createChallenge({ ...input, isActive: true });
      res.status(201).json(newChallenge);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  // Seed Admin se não existir
  const seedDatabase = async () => {
    const admin = await storage.getUserByUsername('admin');
    if (!admin) {
      await storage.createUser({ username: 'admin', password: 'admin', role: 'admin' });
    }
  };
  seedDatabase().catch(console.error);

  return httpServer;
}
