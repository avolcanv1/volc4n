import type { PortableTextBlock } from '@portabletext/types'
import { plainTextToBlocks } from './richText'
import type { QuoteLocale } from './quoteCopy'

export type SiteCopy = {
  language: string
  langEs: string
  langEn: string
  navAria: string
  gallery: string
  index: string
  about: string
  previousImage: string
  nextImage: string
  switchToLight: string
  switchToDark: string
  designCredit: string
  aboutBio: PortableTextBlock[]
}

export const siteCopy: Record<QuoteLocale, SiteCopy> = {
  es: {
    language: 'Idioma',
    langEs: 'ES',
    langEn: 'EN',
    navAria: 'Secciones del sitio',
    gallery: 'Galería',
    index: 'Índice',
    about: 'Acerca',
    previousImage: 'Imagen anterior',
    nextImage: 'Imagen siguiente',
    switchToLight: 'Cambiar a modo claro',
    switchToDark: 'Cambiar a modo oscuro',
    designCredit: 'Diseño y desarrollo web por volc4n',
    aboutBio: plainTextToBlocks(
      'volc4n es un estudio de diseño gráfico dirigido por Andrea Volcán Variya, enfocado en proyectos editoriales e identidades visuales para instituciones culturales y de arte contemporáneo. El trabajo parte de una exploración formal y conceptual de la tipografía como eje narrativo.',
    ),
  },
  en: {
    language: 'Language',
    langEs: 'ES',
    langEn: 'EN',
    navAria: 'Site sections',
    gallery: 'Gallery',
    index: 'Index',
    about: 'About',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    designCredit: 'Design and web development by volc4n',
    aboutBio: plainTextToBlocks(
      'volc4n is a graphic design studio led by Andrea Volcán Variya focused on editorial projects and visual identities for cultural and contemporary art institutions. The work stems from a formal and conceptual exploration of typography as a narrative axis.',
    ),
  },
}
