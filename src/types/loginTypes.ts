import type { loginSchema } from "@/validation/authValidation";
import { z } from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;
