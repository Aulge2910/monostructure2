import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterInputs,
} from "@repo/shared/schemas/register";

export const useRegister = () => {
  const {
    register,
    handleSubmit,
    formState: {isSubmitting, errors },
    reset,
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterInputs) => {
    try {
      console.log("submitting...", data);
      //   write post api heer
      //   toast user here
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
