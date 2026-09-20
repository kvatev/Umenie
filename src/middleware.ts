import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Only run middleware for admin routes to protect admin dashboard
     * and avoid unnecessary processing or auth crashes on public pages.
     */
    "/admin/:path*",
  ],
};
