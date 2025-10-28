import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Play, CheckCircle, BarChart3 } from "lucide-react";

interface AnimeStats {
  total?: number;
  ongoing?: number;
  completed?: number;
  average_rating?: number;
}

interface AnimeStatsProps {
  stats: AnimeStats;
}

export const AnimeStats: React.FC<AnimeStatsProps> = ({ stats }) => {
  if (!stats) return null;

  const statsItems = [
    {
      label: "Всего аниме",
      value: stats.total?.toLocaleString() || "0",
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      label: "Продолжающиеся",
      value: stats.ongoing?.toString() || "0",
      icon: Play,
      color: "text-green-600",
    },
    {
      label: "Завершенные",
      value: stats.completed?.toString() || "0",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      label: "Средний рейтинг",
      value: stats.average_rating?.toFixed(1) || "0.0",
      icon: Star,
      color: "text-amber-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Статистика
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statsItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className={`mb-1 flex items-center justify-center gap-1 ${item.color}`}>
                <item.icon className="h-5 w-5" />
                <span className="text-2xl font-bold">{item.value}</span>
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
