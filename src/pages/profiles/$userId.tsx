import { createFileRoute } from "@tanstack/react-router";
import { Activity, BookMarked, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";

import { Card } from "@/common/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { ActivityFeed } from "@/modules/social/activity";
import {
  ProfileHeader,
  ProfileStats,
  useProfile,
  UserReviews,
} from "@/modules/social/profiles";
import { UserAnimeLists } from "@/modules/user-anime/components/user-anime-lists";

export const Route = createFileRoute("/profiles/$userId")({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = Route.useParams();
  const { data: profile, isLoading, error } = useProfile(userId);
  const [activeTab, setActiveTab] = useState("activity");

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">Профиль не найден</h2>
          <p className="text-muted-foreground">
            Пользователь не существует или был удален
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        <ProfileStats userId={userId} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">
              <Activity className="mr-2 h-4 w-4" />
              Активность
            </TabsTrigger>
            <TabsTrigger value="lists">
              <BookMarked className="mr-2 h-4 w-4" />
              Списки
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="mr-2 h-4 w-4" />
              Рецензии
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <ActivityFeed userId={userId} type="user" />
          </TabsContent>

          <TabsContent value="lists" className="mt-6">
            <UserAnimeLists userId={userId} readonly />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <UserReviews userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
