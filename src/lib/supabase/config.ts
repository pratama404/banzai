export const DEFAULT_USER_EMAIL_DOMAIN = "pwo.local";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http") &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Allows officers/students to log in using either a username (e.g. "pwo2026")
 * or a full email address (e.g. "officer@tnial.mil.id").
 */
export function normalizeIdentifierToEmail(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return "";
  if (clean.includes("@")) return clean;
  return `${clean}@${DEFAULT_USER_EMAIL_DOMAIN}`;
}
