import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const {auth} = NextAuth(authConfig);

import {publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT} from "@/routes"




export default auth((req) => {
  const {pathname} = req.nextUrl;
  const isLoggedIn = !!req.auth;
  
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoutes = authRoutes.includes(pathname);

  if(isApiAuthRoute) return;

  if(isAuthRoutes){
    if(isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
    return;
  }

  if(!isLoggedIn && !isPublicRoute){
    return Response.redirect(new URL("/auth/login", req.nextUrl));
  }
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
