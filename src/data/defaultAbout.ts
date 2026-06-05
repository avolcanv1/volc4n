import type { AboutContent } from '../types'
import { plainTextToBlocks } from '../lib/richText'

export const defaultAbout: AboutContent = {
  bio: plainTextToBlocks(
    'volc4n is a graphic design studio led by Andrea Volcán Variya focused on editorial projects and visual identities for cultural and contemporary art institutions. The work stems from a formal and conceptual exploration of typography as a narrative axis.',
  ),
  email: 'andrea@volc4n.com',
  address: 'Rafael Rebollar 93, San Miguel Chapultepec, Ciudad de México',
}
