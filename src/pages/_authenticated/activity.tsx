import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import { ActivityFeed } from "@/modules/social/activity";

export const Route = createFileRoute("/_authenticated/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"user" | "feed">("feed");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Активность</h1>

      <div className="mb-6 flex gap-2">
        <Button
          variant={activeTab === "feed" ? "default" : "outline"}
          onClick={() => setActiveTab("feed")}
        >
          Лента друзей
        </Button>
        <Button
          variant={activeTab === "user" ? "default" : "outline"}
          onClick={() => setActiveTab("user")}
        >
          Моя активность
        </Button>
      </div>

      <ActivityFeed type={activeTab} />
    </div>
  );
}
