let cachedClient = null;

function readEnv(name) {
  if (import.meta.env && import.meta.env[name]) {
    return String(import.meta.env[name]).trim();
  }
  if (typeof window !== "undefined" && window.__FITTRACK_ENV__ && window.__FITTRACK_ENV__[name]) {
    return String(window.__FITTRACK_ENV__[name]).trim();
  }
  return "";
}

export function getSupabaseStatus() {
  const url = readEnv("VITE_SUPABASE_URL");
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY");
  const hasPlaceholder = url.includes("your-project-ref") || anonKey === "your-public-anon-key";
  return {
    configured: Boolean(url && anonKey && !hasPlaceholder),
    url,
  };
}

export async function getSupabaseClient() {
  const status = getSupabaseStatus();
  if (!status.configured) return null;
  if (cachedClient) return cachedClient;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    cachedClient = createClient(status.url, readEnv("VITE_SUPABASE_ANON_KEY"), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
    return cachedClient;
  } catch (error) {
    console.warn("Supabase client is unavailable. Use npm run dev/build after installing dependencies.", error);
    return null;
  }
}
