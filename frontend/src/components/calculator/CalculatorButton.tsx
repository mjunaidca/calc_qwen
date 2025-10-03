"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
  variant?: "number" | "operation" | "function" | "equals";
  ariaLabel?: string;
}

export default function CalculatorButton({ 
  value, 
  onClick, 
  className,
  variant = "number",
  ariaLabel 
}: CalculatorButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case "operation":
        return "bg-[var(--button-operation-bg)] hover:bg-[var(--button-operation-hover)] text-[var(--button-operation-text)]";
      case "function":
        return "bg-[var(--button-clear-bg)] hover:bg-[var(--button-clear-hover)] text-[var(--button-clear-text)]";
      case "equals":
        return "bg-[var(--button-equals-bg)] hover:bg-[var(--button-equals-hover)] text-[var(--button-equals-text)]";
      case "number":
      default:
        return "bg-[var(--button-number-bg)] hover:bg-[var(--button-number-hover)] text-[var(--button-number-text)]";
    }
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        "child-button h-20 md:h-24 text-2xl md:text-3xl font-bold",
        getButtonStyle(),
        className
      )}
      aria-label={ariaLabel || value}
    >
      {value}
    </Button>
  );
}