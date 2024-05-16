import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, "Password cannot be empty"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"]),
});

export const geojsonSchema = z.object({
  geojson: z.any(),
  email: z.string().email({ message: "Invalid email format" }),
});

export const userQuerySchema = z.object({
  id: z.string().optional()
});
