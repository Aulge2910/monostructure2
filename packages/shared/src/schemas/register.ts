import { z } from "zod";

// Register
export type RegisterInputs = z.infer<typeof registerSchema>;
export const registerSchema = z
	.object({
		email: z
			.string()
			.email("Invalid email format")
			.max(100, "Email must be at most 100 characters"),

		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(50, "Username must be at most 10 characters")
			.regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),

		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(20, "Password must be at most 20 characters")
			.regex(
				/^[\w!@#$%^&*()\-+=<>?]+$/,
				"Password contains invalid characters",
			),

		contact_no: z
			.string()
			.min(8, "Phone number is too short")
			.max(20, "Phone number is too long")
			.regex(/^[0-9+]+$/, "Only numbers and '+' are allowed"),

		confirmed_password: z.string(),
	})
	.refine((data) => data.password === data.confirmed_password, {
		message: "Passwords does not match",
		path: ["confirmed_password"],
	});

// Login
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
