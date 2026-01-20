import React, { useEffect, useState } from "react";

import { Input } from "@/common/components/ui/input";

interface RangeFilterProps {
  from?: number;
  to?: number;
  min: number;
  max: number;
  step?: number;
  onUpdate: (from: number | undefined, to: number | undefined) => void;
  disabled?: boolean;
}

export const RangeFilter = ({
  from,
  to,
  min,
  max,
  step = 1,
  onUpdate,
  disabled,
}: RangeFilterProps) => {
  const [localFrom, setLocalFrom] = useState(from?.toString() || "");
  const [localTo, setLocalTo] = useState(to?.toString() || "");

  useEffect(() => {
    setLocalFrom(from?.toString() || "");
    setLocalTo(to?.toString() || "");
  }, [from, to]);

  const handleBlur = () => {
    const parse = (val: string) => {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    };
    const newFrom = parse(localFrom);
    const newTo = parse(localTo);

    if (newFrom !== from || newTo !== to) {
      onUpdate(newFrom, newTo);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="От"
        value={localFrom}
        onChange={(e) => setLocalFrom(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-9"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="number"
        placeholder="До"
        value={localTo}
        onChange={(e) => setLocalTo(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-9"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  );
};
