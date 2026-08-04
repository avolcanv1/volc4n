import { createClient, type SanityClient } from '@sanity/client'

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID || '3pjczo8m'
export const sanityDataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01'

export const isSanityConfigured = Boolean(sanityProjectId)

function createSanityClient(): SanityClient {
  const useProductionProxy =
    import.meta.env.PROD && typeof window !== 'undefined' && Boolean(window.location?.origin)

  if (useProductionProxy) {
    return createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion,
      useCdn: false,
      useProjectHostname: false,
      apiHost: `${window.location.origin}/sanity-api`,
    })
  }

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion,
    useCdn: true,
  })
}

export const sanityClient: SanityClient | null = isSanityConfigured ? createSanityClient() : null
