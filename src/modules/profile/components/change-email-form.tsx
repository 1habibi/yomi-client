import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/common/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";
import { changeEmailSchema, type ChangeEmailFormData } from "@/modules/auth/types";
import { useUsersControllerChangeEmail } from "@/shared/api/generated/users/users";

export const ChangeEmailForm = () => {
  const queryClient = useQueryClient();
  const changeEmail = useUsersControllerChangeEmail({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      },
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: ChangeEmailFormData) => {
    try {
      await changeEmail.mutateAsync({ data });

      form.reset();
      form.setError("root", {
        type: "success",
        message:
          "Email успешно изменен. Проверьте новый email для подтверждения.",
      });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Произошла ошибка при смене email";
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">Смена Email</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div
            className={`rounded-md border px-4 py-3 text-sm ${
              form.formState.errors.root.type === "success"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {form.formState.errors.root.message}
          </div>
        )}

        <Controller
          control={form.control}
          name="newEmail"
          render={({ field, fieldState }) => (
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Новый Email</FieldLabel>
              <Input
                type="email"
                placeholder="example@email.com"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Пароль для подтверждения</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || changeEmail.isPending}
        >
          {form.formState.isSubmitting || changeEmail.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Изменение...
            </>
          ) : (
            "Изменить Email"
          )}
        </Button>
      </form>
    </div>
  );
};
