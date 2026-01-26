import { z } from "zod";

import type { UserResponseDto } from "@/shared/api/generated/model";

export interface AuthState {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  auth: AuthState;
  login: (user: UserResponseDto) => void;
  logout: () => void;
}

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(4, "Имя должно содержать минимум 4 символа")
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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Текущий пароль обязателен"),
    newPassword: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру",
      ),
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .email("Введите корректный email адрес")
    .min(1, "Email обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Введите корректный email адрес")
    .min(1, "Email обязателен"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру",
      ),
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
