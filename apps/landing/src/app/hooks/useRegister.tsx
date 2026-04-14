import { zodResolver } from "@hookform/resolvers/zod";
import { parseError, registerSchema, type RegisterInputs } from "@repo/shared";
import { useForm } from "react-hook-form";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const useRegister = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterInputs) => {
    console.log(data)
    console.log("DEBUG: process.env VALUE ->", process.env.NEXT_PUBLIC_API_URL);
    console.log("DEBUG: baseUrl VALUE ->", baseUrl);
    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const msg = await parseError(response, setError);
        alert(msg);
        return;
      }

      const result = await response.json();
      alert("register success");
      console.log(result)
      reset();
    } catch (error) {
      console.error("error submitting:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isSubmitting,
    errors,
  };
};
