import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import type { AnimePersonItemDto } from "@/shared/api/generated/model";

interface AnimeStaffProps {
  persons: AnimePersonItemDto[];
}

export const AnimeStaff: React.FC<AnimeStaffProps> = ({ persons }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!persons || persons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">
          Создатели ({persons.length})
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </Button>

      {isExpanded && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {persons.map((item, index) => (
            <div
              key={item.person?.id ?? index}
              className="flex items-start gap-3 rounded-lg border p-4"
            >
              <div className="flex-1">
                <p className="font-medium">{item.person?.name}</p>
                {item.role && (
                  <Badge variant="secondary" className="mt-2">
                    {item.role}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
