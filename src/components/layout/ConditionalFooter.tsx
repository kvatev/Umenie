"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Do not render public footer in the admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}
