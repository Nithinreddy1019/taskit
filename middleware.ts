import { auth } from "@/auth"
import { ApiAuthRoute, AuthRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedin = !!req.auth;


    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);
    const isAuthApiRoute = nextUrl.pathname.startsWith(ApiAuthRoute);

    if(isAuthApiRoute) return;

    if(isAuthRoute) {
      if(isLoggedin) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    };

    if(!isLoggedin && !isPublicRoute) {
      return Response.redirect(new URL("/sign-in", nextUrl))
    };

    return;
});

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
};