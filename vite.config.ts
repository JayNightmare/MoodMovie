import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect deployment base. For a custom domain (CNAME) GitHub Pages serves at root.
// If you fork under a subpath without custom domain, set BASE_REPO_NAME env.
const repoName = import.meta.env.get("GITHUB_REPOSITORY")?.split("/")?.[1];
const isCustomDomain = true; // We ship a CNAME (mood-movies.nexusgit.info)
const inferredBase = isCustomDomain ? "/" : `/${repoName ?? ""}/`;

export default defineConfig({
    base: inferredBase,
    plugins: [react()],
    define: {
        // Surface Supabase config to client from VITE_ env vars
        __SUPABASE_PROJECT_ID__: JSON.stringify(
            import.meta.env.get("VITE_SUPABASE_PROJECT_ID") || ""
        ),
        __SUPABASE_ANON_KEY__: JSON.stringify(
            import.meta.env.get("VITE_SUPABASE_ANON_KEY") || ""
        ),
    },
});
