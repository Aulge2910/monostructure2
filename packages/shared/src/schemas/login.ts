import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type LoginInputs = z.infer<typeof LoginSchema>;
export const LoginSchema = z.object({
	email: z
		.string()
		.email("Invalid email format")
		.max(100, "Email must be at most 100 characters"),
	password: z
		.string()
		.min(1, "Password is required")
		.max(20, "Password must be at most 20 characters"),
});