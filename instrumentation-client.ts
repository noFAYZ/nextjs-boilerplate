import posthog from "posthog-js"

export function initPostHog() {
  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
     person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      defaults: '2025-11-30'
    })
  }
}
