import React from "react";
import { cn } from "@/lib/utils";

interface BulletBulbIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Crisp vector lightbulb icon specifically designed for bullet points
 * in service feature lists and admin editors. Intact, whole, and perfectly
 * balanced with warm glowing bulb body and high-contrast outline.
 */
export function BulletBulbIcon({ className, ...props }: BulletBulbIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Light Rays */}
      <path d="M12 1.5V3" stroke="#fbc531" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.6 4.6L5.7 5.7" stroke="#fbc531" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.4 4.6L18.3 5.7" stroke="#fbc531" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1.5 12H3" stroke="#fbc531" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 12H22.5" stroke="#fbc531" strokeWidth="1.8" strokeLinecap="round" />

      {/* Glass Bulb Body */}
      <path
        d="M12 5C8.96 5 6.5 7.46 6.5 10.5C6.5 12.38 7.45 14.04 8.9 15.05C9.5 15.47 9.87 16.14 9.94 16.88H14.06C14.13 16.14 14.5 15.47 15.1 15.05C16.55 14.04 17.5 12.38 17.5 10.5C17.5 7.46 15.04 5 12 5Z"
        fill="#fbc531"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Subtle shine highlight on the glass */}
      <path
        d="M9.2 8C9.6 7.2 10.5 6.5 11.5 6.5"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Base Screw Threads */}
      <path d="M9.8 18H14.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.4 19.8H13.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.2 21.5H12.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
