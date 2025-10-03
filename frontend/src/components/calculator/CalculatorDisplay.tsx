"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalculatorDisplayProps {
  value: string;
  className?: string;
}

export default function CalculatorDisplay({ value = "0", className }: CalculatorDisplayProps) {
  return (
    <Card 
      className={cn(
        "w-full h-32 flex items-center justify-end p-4 mb-4 child-display rounded-xl shadow-inner",
        className
      )}
    >
      <CardContent className="p-0 flex items-center justify-end w-full h-full">
        <span 
          className={cn(
            "text-4xl md:text-5xl font-bold truncate max-w-full",
            value.length > 10 ? "text-3xl md:text-4xl" : "",
            value.length > 15 ? "text-2xl md:text-3xl" : "",
            value.length > 20 ? "text-xl md:text-2xl" : ""
          )}
          aria-label={`Calculator display showing ${value}`}
        >
          {value}
        </span>
      </CardContent>
    </Card>
  );
}