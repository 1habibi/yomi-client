import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  AvatarUpload,
  ChangeEmailForm,
  ChangePasswordForm,
  ProfileHeader,
} from "@/modules/profile";

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Страница профиля пользователя",
      },
      {
        title: "Профиль - Yomi",
      },
    ],
  }),
});

function RouteComponent() {
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-8">
      <ProfileHeader onAvatarClick={() => setAvatarDialogOpen(true)} />

      <div className="grid gap-6 md:grid-cols-2">
        <ChangePasswordForm />
        <ChangeEmailForm />
      </div>

      <AvatarUpload
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
      />
    </div>
  );
}
