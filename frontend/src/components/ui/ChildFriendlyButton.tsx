"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChildFriendlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
}

const ChildFriendlyButton = React.forwardRef<
  HTMLButtonElement,
  ChildFriendlyButtonProps
>(({ className, size = "md", variant = "primary", ...props }, ref) => {
  // Define size classes
  const sizeClasses = {
    sm: "h-12 px-4 py-2 text-base rounded-lg",
    md: "h-16 px-6 py-3 text-lg rounded-xl", 
    lg: "h-20 px-8 py-4 text-xl rounded-2xl",
    xl: "h-24 px-10 py-5 text-2xl rounded-2xl",
  };

  // Define variant classes with child-friendly colors
  const variantClasses = {
    primary: "bg-[var(--button-operation-bg)] text-[var(--button-operation-text)] hover:bg-[var(--button-operation-hover)]",
    secondary: "bg-[var(--button-number-bg)] text-[var(--button-number-text)] hover:bg-[var(--button-number-hover)]",
    destructive: "bg-[var(--button-clear-bg)] text-[var(--button-clear-text)] hover:bg-[var(--button-clear-hover)]",
    outline: "border border-[var(--button-operation-bg)] bg-transparent text-[var(--button-operation-bg)] hover:bg-[var(--button-operation-bg)] hover:text-[var(--button-operation-text)]",
    ghost: "hover:bg-[var(--button-number-bg)] text-[var(--button-number-text)]",
    link: "underline-offset-4 hover:underline text-[var(--button-operation-bg)] hover:text-[var(--button-operation-hover)]",
  };

  return (
    <Button
      ref={ref}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        "transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
ChildFriendlyButton.displayName = "ChildFriendlyButton";

export { ChildFriendlyButton };