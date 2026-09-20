import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  isPill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isPill = true,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-brand-purple text-white shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover active:scale-[0.98]",
      secondary:
        "bg-brand-purple-light text-brand-purple hover:bg-brand-purple-soft active:scale-[0.98]",
      outline:
        "border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white active:scale-[0.98]",
      ghost:
        "text-brand-dark hover:bg-brand-purple-light hover:text-brand-purple active:scale-[0.98]",
      white:
        "bg-white text-brand-purple shadow-md hover:bg-brand-purple-light active:scale-[0.98]",
    };

    const sizeClasses = {
      sm: "px-4 py-1.5 text-xs font-semibold tracking-wide",
      md: "px-6 py-2.5 text-sm font-bold tracking-wide",
      lg: "px-8 py-3.5 text-base font-bold tracking-wider",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 cursor-pointer font-heading select-none",
          isPill ? "rounded-full" : "rounded-2xl",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
