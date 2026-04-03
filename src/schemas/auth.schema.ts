import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().trim().min(6, "Minimum 6 letter password is required"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().trim().min(6, "Minimum 6 letter password is required"),
});
