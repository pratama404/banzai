import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = pathname.startsWith("/materi") || pathname.startsWith("/admin");
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname.startsWith("/login");

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

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && isAuthenticated && userRole !== "admin") {
    const materiUrl = request.nextUrl.clone();
    materiUrl.pathname = "/materi";
    materiUrl.search = "";
    return NextResponse.redirect(materiUrl);
  }

  if (isLoginPath && isAuthenticated) {
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
