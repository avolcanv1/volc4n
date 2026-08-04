export type QuoteLocale = 'es' | 'en'

type QuoteCopy = {
  brand: string
  title: string
  lede: string
  requiredMark: string
  selectOption: string
  submit: string
  submitting: string
  confirmation: string
  submitError: string
  langEs: string
  langEn: string
  sections: {
    context: string
    scope: string
    design: string
    logistics: string
    support: string
  }
  fields: {
    organizationName: string
    organizationDescription: string
    siteType: string
    siteTypeOther: string
    siteStatus: string
    currentSiteUrl: string
    references: string
    mainGoal: string
    pageCount: string
    needsCms: string
    updateFrequency: string
    multilingual: string
    features: string
    featuresOther: string
    hasDomainHosting: string
    brandIdentity: string
    contentReadiness: string
    needsContentProduction: string
    launchDate: string
    launchDatePlaceholder: string
    budgetRange: string
    budgetOptional: string
    contactName: string
    contactEmail: string
    decisionMaker: string
    feedbackMethod: string
    feedbackMethodOther: string
    needsMaintenance: string
    hasTechnicalKnowledge: string
  }
  errors: {
    required: string
    select: string
    siteTypeOther: string
    url: string
    email: string
    feedbackOther: string
  }
  options: {
    siteTypes: string[]
    siteStatus: string[]
    pageCounts: string[]
    yesNoUnsure: string[]
    yesNo: string[]
    updateFrequency: string[]
    features: string[]
    brandIdentity: string[]
    contentReadiness: string[]
    budgetRanges: string[]
    feedbackMethods: string[]
  }
}

/** Stable option values stored in Sanity (Spanish). Labels vary by locale. */
export const OPTION_VALUES = {
  siteTypes: ['Portafolio', 'Sitio institucional', 'Editorial', 'Tienda en línea', 'Landing page', 'Otro'],
  siteStatus: ['Nuevo', 'Rediseño'],
  pageCounts: ['1–3', '4–6', '7–10', 'Más de 10', 'No estoy seguro'],
  yesNoUnsure: ['Sí', 'No', 'No estoy seguro'],
  yesNo: ['Sí', 'No'],
  updateFrequency: ['Rara vez', 'Mensual', 'Semanal', 'Constantemente'],
  features: [
    'Formularios de contacto',
    'Newsletter',
    'Tienda en línea',
    'Calendario de eventos',
    'Buscador',
    'Integración con redes sociales',
    'Otro',
  ],
  brandIdentity: ['Sí, completa', 'Sí, parcial', 'No, hay que diseñarla'],
  contentReadiness: ['Listos', 'Parcialmente listos', 'Hay que producirlos'],
  budgetRanges: [
    'Menos de $20,000 MXN',
    '$20,000 – $50,000 MXN',
    '$50,000 – $100,000 MXN',
    '$100,000 – $200,000 MXN',
    'Más de $200,000 MXN',
    'Prefiero no decirlo',
  ],
  feedbackMethods: ['Reuniones', 'Correo', 'Comentarios en Figma', 'Otro'],
} as const

/** Spanish helper copy shown when a yes/no/unsure field is "No estoy seguro". */
export const UNSURE_HELPERS = {
  needsCms:
    'Un CMS te permite editar textos e imágenes del sitio sin necesitar a un desarrollador. Si no estás seguro, probablemente lo necesitas.',
  hasDomainHosting:
    'El dominio es la dirección de tu sitio (ej. tuestudio.com) y el hosting es donde vive el sitio en internet. Si no los tienes, podemos ayudarte a conseguirlos.',
  needsContentProduction:
    'Esto se refiere a tomar fotos nuevas o escribir textos para el sitio, en caso de que no tengas material propio listo para usar.',
  needsMaintenance:
    'El mantenimiento incluye actualizaciones de contenido, correcciones o cambios pequeños después de que el sitio esté publicado.',
} as const

export type UnsureHelperField = keyof typeof UNSURE_HELPERS

export const quoteCopy: Record<QuoteLocale, QuoteCopy> = {
  es: {
    brand: 'volc4n',
    title: 'Brief de proyecto',
    lede: 'Cuéntanos sobre tu proyecto para preparar una cotización. Los campos marcados con * son obligatorios.',
    requiredMark: '*',
    selectOption: 'Selecciona una opción',
    submit: 'Enviar brief',
    submitting: 'Enviando…',
    confirmation: 'Gracias. Recibimos tu información y nos pondremos en contacto pronto.',
    submitError: 'No pudimos enviar el formulario. Inténtalo de nuevo.',
    langEs: 'ES',
    langEn: 'EN',
    sections: {
      context: 'Sobre el proyecto',
      scope: 'Alcance funcional',
      design: 'Contenido y diseño',
      logistics: 'Logística',
      support: 'Mantenimiento a futuro',
    },
    fields: {
      organizationName: 'Nombre de la organización',
      organizationDescription: '¿A qué se dedican?',
      siteType: '¿Qué tipo de sitio necesitan?',
      siteTypeOther: 'Especifica el tipo de sitio',
      siteStatus: '¿Es un sitio nuevo o rediseño?',
      currentSiteUrl: 'Link del sitio actual',
      references: 'Referencias o sitios que te gusten',
      mainGoal: '¿Cuál es el objetivo principal del sitio?',
      pageCount: 'Número aproximado de páginas o secciones',
      needsCms: '¿Necesitas actualizar el contenido tú mismo?',
      updateFrequency: '¿Con qué frecuencia actualizarías el contenido?',
      multilingual: '¿Necesitas el sitio en más de un idioma?',
      features: '¿Qué funcionalidades necesitas?',
      featuresOther: 'Otra funcionalidad',
      hasDomainHosting: '¿Ya tienes dominio y hosting?',
      brandIdentity: '¿Ya cuentas con identidad de marca?',
      contentReadiness: '¿Tienes los contenidos listos?',
      needsContentProduction: '¿Necesitas producción fotográfica o de contenido?',
      launchDate: 'Fecha ideal de lanzamiento',
      launchDatePlaceholder: 'Ej. marzo 2026 / antes de una exposición',
      budgetRange: 'Rango de presupuesto aproximado',
      budgetOptional: 'Selecciona una opción (opcional)',
      contactName: 'Nombre de contacto',
      contactEmail: 'Correo de contacto',
      decisionMaker: '¿Quién aprueba las decisiones finales?',
      feedbackMethod: '¿Cómo prefieres dar retroalimentación?',
      feedbackMethodOther: 'Especifica tu preferencia',
      needsMaintenance: '¿Vas a necesitar mantenimiento después del lanzamiento?',
      hasTechnicalKnowledge: '¿Alguien de tu equipo tiene conocimientos técnicos?',
    },
    errors: {
      required: 'Este campo es obligatorio.',
      select: 'Selecciona una opción.',
      siteTypeOther: 'Describe el tipo de sitio.',
      url: 'Ingresa un enlace válido (incluye https://).',
      email: 'Ingresa un correo válido.',
      feedbackOther: 'Describe tu preferencia.',
    },
    options: {
      siteTypes: [...OPTION_VALUES.siteTypes],
      siteStatus: [...OPTION_VALUES.siteStatus],
      pageCounts: [...OPTION_VALUES.pageCounts],
      yesNoUnsure: [...OPTION_VALUES.yesNoUnsure],
      yesNo: [...OPTION_VALUES.yesNo],
      updateFrequency: [...OPTION_VALUES.updateFrequency],
      features: [...OPTION_VALUES.features],
      brandIdentity: [...OPTION_VALUES.brandIdentity],
      contentReadiness: [...OPTION_VALUES.contentReadiness],
      budgetRanges: [...OPTION_VALUES.budgetRanges],
      feedbackMethods: [...OPTION_VALUES.feedbackMethods],
    },
  },
  en: {
    brand: 'volc4n',
    title: 'Project brief',
    lede: 'Tell us about your project so we can prepare a quote. Fields marked with * are required.',
    requiredMark: '*',
    selectOption: 'Select an option',
    submit: 'Submit brief',
    submitting: 'Sending…',
    confirmation: 'Thank you. We received your information and will be in touch soon.',
    submitError: 'We could not submit the form. Please try again.',
    langEs: 'ES',
    langEn: 'EN',
    sections: {
      context: 'About the project',
      scope: 'Functional scope',
      design: 'Content and design',
      logistics: 'Logistics',
      support: 'Ongoing support',
    },
    fields: {
      organizationName: 'Organization name',
      organizationDescription: 'What do you do?',
      siteType: 'What kind of site do you need?',
      siteTypeOther: 'Specify the site type',
      siteStatus: 'Is it a new site or a redesign?',
      currentSiteUrl: 'Current site link',
      references: 'References or sites you like',
      mainGoal: 'What is the main goal of the site?',
      pageCount: 'Approximate number of pages or sections',
      needsCms: 'Do you need to update the content yourself?',
      updateFrequency: 'How often would you update the content?',
      multilingual: 'Do you need the site in more than one language?',
      features: 'What features do you need?',
      featuresOther: 'Other feature',
      hasDomainHosting: 'Do you already have a domain and hosting?',
      brandIdentity: 'Do you already have a brand identity?',
      contentReadiness: 'Is your content ready?',
      needsContentProduction: 'Do you need photography or content production?',
      launchDate: 'Ideal launch date',
      launchDatePlaceholder: 'E.g. March 2026 / before an exhibition',
      budgetRange: 'Approximate budget range',
      budgetOptional: 'Select an option (optional)',
      contactName: 'Contact name',
      contactEmail: 'Contact email',
      decisionMaker: 'Who approves final decisions?',
      feedbackMethod: 'How do you prefer to give feedback?',
      feedbackMethodOther: 'Specify your preference',
      needsMaintenance: 'Will you need maintenance after launch?',
      hasTechnicalKnowledge: 'Does anyone on your team have technical knowledge?',
    },
    errors: {
      required: 'This field is required.',
      select: 'Please select an option.',
      siteTypeOther: 'Please describe the site type.',
      url: 'Enter a valid link (include https://).',
      email: 'Enter a valid email.',
      feedbackOther: 'Please describe your preference.',
    },
    options: {
      siteTypes: ['Portfolio', 'Institutional site', 'Editorial', 'Online store', 'Landing page', 'Other'],
      siteStatus: ['New', 'Redesign'],
      pageCounts: ['1–3', '4–6', '7–10', 'More than 10', 'Not sure'],
      yesNoUnsure: ['Yes', 'No', 'Not sure'],
      yesNo: ['Yes', 'No'],
      updateFrequency: ['Rarely', 'Monthly', 'Weekly', 'Constantly'],
      features: [
        'Contact forms',
        'Newsletter',
        'Online store',
        'Event calendar',
        'Search',
        'Social media integration',
        'Other',
      ],
      brandIdentity: ['Yes, complete', 'Yes, partial', 'No, it needs to be designed'],
      contentReadiness: ['Ready', 'Partially ready', 'Needs to be produced'],
      budgetRanges: [
        'Under $20,000 MXN',
        '$20,000 – $50,000 MXN',
        '$50,000 – $100,000 MXN',
        '$100,000 – $200,000 MXN',
        'Over $200,000 MXN',
        'Prefer not to say',
      ],
      feedbackMethods: ['Meetings', 'Email', 'Figma comments', 'Other'],
    },
  },
}
