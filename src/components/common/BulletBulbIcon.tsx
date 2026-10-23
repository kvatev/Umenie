import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BulletBulbIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number;
}

/**
 * Authentic hand-drawn brand lightbulb icon (/images/bulb.webp)
 * used for bullet points and feature lists across every service, blog, and site enumerations.
 */
export function BulletBulbIcon({ className, ...props }: BulletBulbIconProps) {
  return (
    <span
      className={cn(
        "relative inline-block w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 select-none pointer-events-none drop-shadow-sm",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <Image
        src="/images/bulb.webp"
        alt=""
        fill
        sizes="24px"
        className="object-contain"
      />
    </span>
  );
}
