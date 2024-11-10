import { useCallback } from "react";

export const useValidators = () => {
  const emailValidator = useCallback((value: string) => {
    if (!value) return "Email is required";
    if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g))
      return "Invalid email";
    return "";
  }, []);

  const passwordValidator = useCallback((value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }, []);

  const textValidator = useCallback((value: string, name: string) => {
    if (!value) return `${name} is required`;
    return "";
  }, []);

  return { emailValidator, passwordValidator, textValidator };
};
