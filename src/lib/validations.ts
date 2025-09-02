import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Имя должно содержать минимум 2 символа")
      .max(50, "Имя не должно превышать 50 символов"),
    email: z
      .string()
      .email("Введите корректный email адрес")
      .min(1, "Email обязателен"),
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру",
      ),
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email("Введите корректный email адрес")
    .min(1, "Email обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
