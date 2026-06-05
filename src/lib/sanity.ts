import { createClient, type SanityClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '3pjczo8m'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01'

export const isSanityConfigured = Boolean(projectId)

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null
