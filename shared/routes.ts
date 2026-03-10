import { z } from 'zod';
import { insertStudentSchema, insertChallengeSchema, students, workouts, challenges, users } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ 
          user: z.custom<typeof users.$inferSelect>(), 
          student: z.custom<typeof students.$inferSelect>().optional().nullable() 
        }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.object({ 
          user: z.custom<typeof users.$inferSelect>(), 
          student: z.custom<typeof students.$inferSelect>().optional().nullable() 
        }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  students: {
    list: {
      method: 'GET' as const,
      path: '/api/students' as const,
      responses: {
        200: z.array(z.custom<typeof students.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/students/:id' as const,
      responses: {
        200: z.custom<typeof students.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/students' as const,
      input: insertStudentSchema.omit({ id: true, userId: true, points: true }),
      responses: {
        201: z.custom<typeof students.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/students/:id' as const,
      input: insertStudentSchema.partial(),
      responses: {
        200: z.custom<typeof students.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    renew: {
      method: 'POST' as const,
      path: '/api/students/:id/renew' as const,
      responses: {
        200: z.custom<typeof students.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    deactivate: {
      method: 'POST' as const,
      path: '/api/students/:id/deactivate' as const,
      responses: {
        200: z.custom<typeof students.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  workouts: {
    list: {
      method: 'GET' as const,
      path: '/api/workouts' as const,
      responses: {
        200: z.array(z.custom<typeof workouts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/workouts' as const,
      input: z.object({ studentId: z.coerce.number() }),
      responses: {
        201: z.custom<typeof workouts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  challenges: {
    list: {
      method: 'GET' as const,
      path: '/api/challenges' as const,
      responses: {
        200: z.array(z.custom<typeof challenges.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/challenges' as const,
      input: insertChallengeSchema.omit({ id: true }),
      responses: {
        201: z.custom<typeof challenges.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
