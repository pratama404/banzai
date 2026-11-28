import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLoginPath = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  const isUserLoginPath = pathname === "/login" || pathname.startsWith("/login/");
  const isAdminPath = pathname.startsWith("/admin") && !isAdminLoginPath;
  const isMateriPath = pathname.startsWith("/materi");

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let isAuthenticated = false;
  let userRole: "admin" | "user" = "user";

  // If Supabase is configured, strictly verify real Supabase Auth session
  if (isSupabaseConfigured()) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      isAuthenticated = true;
      if (user.app_metadata?.role === "admin") {
        userRole = "admin";
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.role === "admin") {
          userRole = "admin";
        }
      }
    }
  } else {
    // Fallback cookie session is ONLY allowed when Supabase is not configured
    const fallbackCookie = request.cookies.get("pwo_session")?.value;
    if (fallbackCookie === "admin" || fallbackCookie === "user") {
      isAuthenticated = true;
      userRole = fallbackCookie;
    }
  }

  // Unauthenticated access to /admin -> dedicated Admin Login
  if (isAdminPath && !isAuthenticated) {
    const adminLoginUrl = request.nextUrl.clone();
    adminLoginUrl.pathname = "/admin/login";
    adminLoginUrl.search = "";
    return NextResponse.redirect(adminLoginUrl);
  }

  // Authenticated non-admin trying to enter /admin -> send to /materi
  if (isAdminPath && isAuthenticated && userRole !== "admin") {
    const materiUrl = request.nextUrl.clone();
    materiUrl.pathname = "/materi";
    materiUrl.search = "";
    return NextResponse.redirect(materiUrl);
  }

  // Unauthenticated access to /materi -> Student Login
  if (isMateriPath && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged-in admin visiting /admin/login -> /admin
  if (isAdminLoginPath && isAuthenticated && userRole === "admin") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  // Already logged-in user visiting /login -> /materi
  if (isUserLoginPath && isAuthenticated) {
    const destUrl = request.nextUrl.clone();
    destUrl.pathname = "/materi";
    destUrl.search = "";
    return NextResponse.redirect(destUrl);
  }

  return response;
}

export const config = {
  matcher: ["/materi/:path*", "/admin/:path*", "/login"],
};
