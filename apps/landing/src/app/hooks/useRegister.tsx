import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInputs } from "@repo/shared";
import { parseError } from "@repo/shared";
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
