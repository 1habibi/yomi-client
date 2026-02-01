import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  AvatarUpload,
  ChangeEmailForm,
  ChangePasswordForm,
  ProfileHeader,
} from "@/modules/profile";
import { MyAnimeLists } from "@/modules/user-anime";

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
    <div className="container mx-auto max-w-6xl space-y-8 p-4 py-8">
      <div className="space-y-6">
        <ProfileHeader onAvatarClick={() => setAvatarDialogOpen(true)} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ChangePasswordForm />
          <ChangeEmailForm />
        </div>
      </div>
      <div className="border-t" />
      <MyAnimeLists />
      <AvatarUpload
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
      />
    </div>
  );
}
