import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^@]+@[^@]+\.[^@]+$/),
  password: z.string().min(1, "Password is required"),
});

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(15, "Password must be at most 15 characters")
  .refine(
    (val) => /[A-Z]/.test(val),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (val) => /[a-z]/.test(val),
    "Password must contain at least one lowercase letter"
  )
  .refine((val) => /\d/.test(val), "Password must contain at least one number")
  .refine(
    (val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(val),
    "Password must contain at least one special character"
  )
  .refine(
    (val) =>
      (val.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g) || []).length === 1,
    "Password must contain exactly one special character"
  );

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Name is required"),
    lastName: z.string().min(2, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .regex(/^[^@]+@[^@]+\.[^@]+$/),
    mobile: z.string().regex(phoneRegex, "Invalid phone number"),
    password: passwordSchema,
    confirmPassword: z.string(),
    profilePicture: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
