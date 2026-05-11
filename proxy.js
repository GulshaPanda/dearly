import { updateSession } from "./lib/supabase/middleware";

// Next.js 16: middleware was renamed to proxy. This handles every request.
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on every request EXCEPT for static files, images, favicons, and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
