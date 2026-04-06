import { z } from "zod";


export type RegisterInputs = z.infer<typeof registerSchema>;

export const registerSchema = z
	.object({
		email: z.string().email("Invalid email format"),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(10, "Username must be at most 10 characters")
			.regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(20, "Password must be at most 20 characters")

			.regex(
				/^[\w!@#$%^&*()\-+=<>?]+$/,
				"Password contains invalid characters",
			),
		confirmed_password: z.string(),
		contact_no: z
			.string()
			.min(8, "Phone number is too short")
			.max(20, "Phone number is too long")
			.regex(/^[0-9+]+$/, "Only numbers and '+' are allowed"),
	})
	.refine((data) => data.password === data.confirmed_password, {
		message: "password does not match",
		path: ["confirmed_password"],
	});
