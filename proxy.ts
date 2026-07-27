import { auth } from "@/auth";

// First line of defense: every request that isn't the login page, the auth
// endpoints, or a build asset must carry a valid session. This is what
// protects the static downloads under /skills/**, the Cowork .plugin, and
// any other file in public/ — those never run page code, so middleware is
// the only server-side gate they get.
//
// The pages themselves ALSO check the session server-side (see app/page.tsx),
// so a middleware failure alone does not expose the catalog.
export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/brand/"); // masthead logos, needed by the login page

  if (isPublicPath) return;

  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    // Send the user back where they were headed after signing in.
    if (pathname !== "/") url.searchParams.set("from", pathname);
    return Response.redirect(url);
  }
});

export const config = {
  // Match everything except Next's own build output and the favicon.
  // NOTE: this deliberately DOES cover public/ files so the skill markdown,
  // the .plugin bundle, lander.html and the SOP PDF are all gated.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
