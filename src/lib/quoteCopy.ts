export type QuoteLocale = 'es' | 'en'

/** Stable service values stored in Sanity (Spanish). */
export const SERVICE_VALUES = {
  web: 'Sitio web',
  book: 'Libro/editorial',
  brand: 'Identidad de marca',
} as const

export type ServiceValue = (typeof SERVICE_VALUES)[keyof typeof SERVICE_VALUES]

export const BRAND_NEEDS_DESIGN = 'No, hay que diseñarla'

/** Stable option values stored in Sanity (Spanish). */
export const OPTION_VALUES = {
  services: [SERVICE_VALUES.web, SERVICE_VALUES.book, SERVICE_VALUES.brand],
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
  publicationTypes: [
    'Libro de artista',
    'Catálogo',
    'Monografía',
    'Editorial independiente',
    'Otro',
  ],
  contentBalance: ['Texto', 'Imagen', 'Balance'],
  bookLanguages: ['1', '2', '3', 'Más de 3'],
  editorialCare: ['Sí, ya lo tenemos', 'No, lo necesitamos', 'No estoy seguro'],
  printScope: [
    'Solo diseño y archivo final',
    'Diseño + preprensa + seguimiento de impresión',
    'No estoy seguro',
  ],
  brandStatus: ['Nueva', 'Rediseño'],
  brandElements: [
    'Logotipo',
    'Paleta de color',
    'Tipografía',
  ],
  namingDefined: ['Sí', 'No, también necesitamos ayuda con el nombre'],
  brandApplications: [
    'Tarjetas de presentación',
    'Papelería membretada',
    'Invitaciones',
    'Programas de mano',
    'Folletos de sala',
    'Redes sociales',
    'Firma de correo electrónico',
    'Newsletter',
    'Deck de presentación',
    'Señalética interior',
    'Cédulas',
    'Textos de muro',
    'Playeras',
    'Bolsas de tela',
    'Postales',
    'Stickers',
    'Empaque',
    'Otro',
  ],
  feedbackMethods: ['Reuniones', 'Correo', 'Comentarios en Figma', 'Otro'],
  portfolioProjectCounts: ['1–5', '6–15', '16–30', 'Más de 30'],
  portfolioEntryFields: [
    'Título del proyecto',
    'Cliente',
    'Año',
    'Categoría / Tipo de proyecto',
    'Descripción breve',
    'Descripción larga',
    'Galería de imágenes',
    'Video',
    'Rol / Créditos',
    'Herramientas o técnicas usadas',
    'Link externo',
    'Marcar como proyecto destacado',
    'Otro',
  ],
} as const

/** Stable slug for the free-text "Other" site section option. */
export const SITE_SECTION_OTHER = 'other'

/** Portfolio "Trabajos / Proyectos" section value — gates the portfolio projects group. */
export const SITE_SECTION_WORKS = 'works'

/** Pre-checked when the portfolio projects group first appears. */
export const PORTFOLIO_ENTRY_FIELD_DEFAULTS = [
  'Título del proyecto',
  'Galería de imágenes',
  'Descripción breve',
] as const

/**
 * Site section option values by site type (Spanish siteType values).
 * Each list ends with SITE_SECTION_OTHER.
 */
export const SITE_SECTIONS_BY_TYPE: Record<string, readonly string[]> = {
  Portafolio: [
    'home',
    'about-bio',
    'works',
    'process',
    'contact',
    'press',
    'cv',
    SITE_SECTION_OTHER,
  ],
  'Sitio institucional': [
    'home',
    'about-us',
    'programs',
    'team',
    'exhibitions',
    'history',
    'press',
    'contact',
    'calls',
    'donations',
    SITE_SECTION_OTHER,
  ],
  Editorial: [
    'home',
    'catalog',
    'about-publisher',
    'authors',
    'where-to-buy',
    'blog',
    'contact',
    'distribution',
    SITE_SECTION_OTHER,
  ],
  'Tienda en línea': [
    'home',
    'product-catalog',
    'product-page',
    'cart-checkout',
    'about-brand',
    'shipping',
    'contact',
    'user-account',
    SITE_SECTION_OTHER,
  ],
  'Landing page': [
    'hero',
    'about-project',
    'features-benefits',
    'testimonials',
    'cta',
    'faq',
    'contact',
    SITE_SECTION_OTHER,
  ],
}

/** Spanish labels for email / Sanity display (keyed by siteType → option value). */
export const SITE_SECTION_LABELS_ES: Record<string, Record<string, string>> = {
  Portafolio: {
    home: 'Inicio',
    'about-bio': 'Sobre mí / Bio',
    works: 'Trabajos / Proyectos',
    process: 'Proceso',
    contact: 'Contacto',
    press: 'Prensa / Menciones',
    cv: 'CV / Currículum',
    [SITE_SECTION_OTHER]: 'Otro',
  },
  'Sitio institucional': {
    home: 'Inicio',
    'about-us': 'Sobre nosotros',
    programs: 'Programas / Actividades',
    team: 'Equipo',
    exhibitions: 'Exposiciones / Eventos',
    history: 'Historia',
    press: 'Prensa',
    contact: 'Contacto',
    calls: 'Convocatorias',
    donations: 'Donaciones / Apoyo',
    [SITE_SECTION_OTHER]: 'Otro',
  },
  Editorial: {
    home: 'Inicio',
    catalog: 'Catálogo / Publicaciones',
    'about-publisher': 'Sobre la editorial',
    authors: 'Autores',
    'where-to-buy': 'Dónde comprar',
    blog: 'Blog / Novedades',
    contact: 'Contacto',
    distribution: 'Distribución',
    [SITE_SECTION_OTHER]: 'Otro',
  },
  'Tienda en línea': {
    home: 'Inicio',
    'product-catalog': 'Catálogo de productos',
    'product-page': 'Ficha de producto',
    'cart-checkout': 'Carrito / Checkout',
    'about-brand': 'Sobre la marca',
    shipping: 'Envíos y devoluciones',
    contact: 'Contacto',
    'user-account': 'Cuenta de usuario',
    [SITE_SECTION_OTHER]: 'Otro',
  },
  'Landing page': {
    hero: 'Hero / Encabezado',
    'about-project': 'Sobre el proyecto',
    'features-benefits': 'Características / Beneficios',
    testimonials: 'Testimonios',
    cta: 'Llamado a la acción',
    faq: 'Preguntas frecuentes',
    contact: 'Contacto',
    [SITE_SECTION_OTHER]: 'Otro',
  },
}

export function getSiteSectionOptions(siteType: string): readonly string[] {
  return SITE_SECTIONS_BY_TYPE[siteType] ?? []
}

export function formatSiteSectionsForEmail(
  siteType: string | undefined,
  sections: string[] | undefined,
): string | undefined {
  if (!siteType || !sections?.length) return undefined
  const labels = SITE_SECTION_LABELS_ES[siteType]
  if (!labels) return sections.join(', ')
  return sections.map((value) => labels[value] ?? value).join(', ')
}

export const BRAND_APPLICATION_GROUPS = [
  {
    key: 'print',
    values: [
      'Tarjetas de presentación',
      'Papelería membretada',
      'Invitaciones',
      'Programas de mano',
      'Folletos de sala',
    ],
  },
  {
    key: 'digital',
    values: [
      'Redes sociales',
      'Firma de correo electrónico',
      'Newsletter',
      'Deck de presentación',
    ],
  },
  {
    key: 'space',
    values: [
      'Señalética interior',
      'Cédulas',
      'Textos de muro',
    ],
  },
  {
    key: 'merch',
    values: ['Playeras', 'Bolsas de tela', 'Postales', 'Stickers', 'Empaque'],
  },
] as const

export type QuestionHelpKey =
  | 'brandIdentity'
  | 'needsCms'
  | 'hasDomainHosting'
  | 'editorialCare'
  | 'printScope'
  | 'needsIsbn'
  | 'needsBrandManual'
  | 'needsMaintenance'
  | 'portfolioFilterByCategory'

/** Help copy for QuestionHelp (?), keyed by locale. */
export const QUESTION_HELP: Record<QuoteLocale, Record<QuestionHelpKey, string>> = {
  es: {
    brandIdentity:
      'La identidad de marca incluye tu logotipo, paleta de colores y tipografía. Si no cuentas con ella, la podemos diseñar como parte del proyecto.',
    needsCms: 'Un CMS te permite editar textos e imágenes del sitio sin necesitar a un desarrollador.',
    hasDomainHosting:
      'El dominio es la dirección de tu sitio (ej. tuestudio.com) y el hosting es donde vive el sitio en internet. Si no los tienes, podemos ayudarte a conseguirlos.',
    editorialCare:
      'El cuidado editorial es la revisión de estilo, consistencia y coherencia del texto antes de maquetarlo.',
    printScope:
      'Preprensa es la preparación técnica del archivo final para impresión (perfiles de color, sangrados, marcas de corte).',
    needsIsbn: 'El ISBN es el número que identifica una publicación para su venta y distribución formal.',
    needsBrandManual:
      'Un manual de marca documenta cómo debe usarse tu identidad (logo, colores, tipografía) para mantener consistencia en cualquier aplicación futura.',
    needsMaintenance:
      'El mantenimiento incluye actualizaciones de contenido, correcciones o cambios pequeños después de que el proyecto esté finalizado.',
    portfolioFilterByCategory:
      'Por ejemplo, poder filtrar los proyectos por tipología (branding, editorial, web) o por año.',
  },
  en: {
    brandIdentity:
      'Brand identity includes your logo, color palette, and typography. If you don’t have one yet, we can design it as part of the project.',
    needsCms: 'A CMS lets you edit the site’s text and images yourself without needing a developer.',
    hasDomainHosting:
      'The domain is your site’s address (e.g. yourstudio.com) and hosting is where the site lives on the internet. If you don’t have them, we can help you get them.',
    editorialCare:
      'Editorial care is the review of style, consistency, and coherence of the text before layout.',
    printScope:
      'Prepress is the technical preparation of the final file for print (color profiles, bleeds, crop marks).',
    needsIsbn: 'An ISBN is the number that identifies a publication for formal sale and distribution.',
    needsBrandManual:
      'A brand manual documents how your identity should be used (logo, colors, typography) so it stays consistent across future applications.',
    needsMaintenance:
      'Maintenance covers content updates, fixes, or small changes after the project is delivered.',
    portfolioFilterByCategory:
      'For example, being able to filter projects by typology (branding, editorial, web) or by year.',
  },
}

type QuoteCopy = {
  brand: string
  requiredMark: string
  selectOption: string
  submit: string
  submitting: string
  confirmation: string
  submitError: string
  emailDidYouMean: string
  langEs: string
  langEn: string
  sections: {
    web: string
    book: string
    brand: string
    logistics: string
    support: string
  }
  applicationGroups: {
    print: string
    digital: string
    space: string
    merch: string
  }
  fields: {
    services: string
    organizationName: string
    organizationDescription: string
    siteType: string
    siteTypeOther: string
    siteStatus: string
    currentSiteUrl: string
    references: string
    mainGoal: string
    pageCount: string
    siteSections: string
    siteSectionsOther: string
    portfolioProjectCount: string
    portfolioEntryFields: string
    portfolioEntryFieldsOther: string
    portfolioFilterByCategory: string
    needsCms: string
    updateFrequency: string
    multilingual: string
    features: string
    featuresOther: string
    hasDomainHosting: string
    brandIdentity: string
    contentReadiness: string
    publicationType: string
    publicationTypeOther: string
    bookPageCount: string
    contentBalance: string
    complexLayout: string
    bookLanguages: string
    editorialCare: string
    printScope: string
    hasPrinter: string
    printRun: string
    needsIsbn: string
    brandStatus: string
    brandElements: string
    namingDefined: string
    brandApplications: string
    brandApplicationsOther: string
    needsBrandManual: string
    brandAudience: string
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
    services: string
    siteTypeOther: string
    publicationTypeOther: string
    url: string
    email: string
    feedbackOther: string
  }
  options: {
    services: string[]
    siteTypes: string[]
    siteStatus: string[]
    pageCounts: string[]
    yesNoUnsure: string[]
    yesNo: string[]
    updateFrequency: string[]
    features: string[]
    brandIdentity: string[]
    contentReadiness: string[]
    publicationTypes: string[]
    contentBalance: string[]
    bookLanguages: string[]
    editorialCare: string[]
    printScope: string[]
    brandStatus: string[]
    brandElements: string[]
    namingDefined: string[]
    brandApplications: string[]
    feedbackMethods: string[]
    siteSections: Record<string, string[]>
    portfolioProjectCounts: string[]
    portfolioEntryFields: string[]
  }
}

export const quoteCopy: Record<QuoteLocale, QuoteCopy> = {
  es: {
    brand: 'volc4n',
    requiredMark: '*',
    selectOption: 'Selecciona una opción',
    submit: 'Enviar brief',
    submitting: 'Enviando…',
    confirmation: 'Gracias. Recibimos tu información y nos pondremos en contacto pronto.',
    submitError: 'No pudimos enviar el formulario. Inténtalo de nuevo.',
    emailDidYouMean: '¿Quisiste decir {email}?',
    langEs: 'ES',
    langEn: 'EN',
    sections: {
      web: 'Sobre el sitio web',
      book: 'Sobre el libro',
      brand: 'Sobre la identidad de marca',
      logistics: 'Logística',
      support: 'Mantenimiento a futuro',
    },
    applicationGroups: {
      print: 'Impreso y papelería',
      digital: 'Digital',
      space: 'Espacios físicos y exhibición',
      merch: 'Merchandising y objetos',
    },
    fields: {
      services: '¿Qué servicios te interesan?',
      organizationName: 'Nombre de la organización o proyecto',
      organizationDescription: '¿A qué se dedican?',
      siteType: '¿Qué tipo de sitio necesitas?',
      siteTypeOther: 'Especifica el tipo de sitio',
      siteStatus: '¿Es un sitio nuevo o un rediseño?',
      currentSiteUrl: 'Link del sitio actual',
      references: 'Referencias o sitios que te gusten',
      mainGoal: '¿Cuál es el objetivo principal del sitio?',
      pageCount: 'Número aproximado de páginas o secciones',
      siteSections: '¿Qué secciones te gustaría incluir?',
      siteSectionsOther: 'Otra sección',
      portfolioProjectCount: '¿Cuántos proyectos aproximadamente quieres incluir al inicio?',
      portfolioEntryFields: '¿Qué información necesita cada proyecto?',
      portfolioEntryFieldsOther: 'Otra información',
      portfolioFilterByCategory: '¿Los proyectos deben poder filtrarse o agruparse por tipología?',
      needsCms: '¿Necesitas actualizar el contenido tú mismo a través de un CMS?',
      updateFrequency: '¿Con qué frecuencia actualizarías el contenido?',
      multilingual: '¿Necesitas el sitio en más de un idioma?',
      features: '¿Qué funcionalidades necesitas?',
      featuresOther: 'Otra funcionalidad',
      hasDomainHosting: '¿Ya tienes dominio y hosting?',
      brandIdentity: '¿Ya cuentas con identidad de marca?',
      contentReadiness: '¿Tienes los contenidos listos (textos, imágenes)?',
      publicationType: 'Tipo de publicación',
      publicationTypeOther: 'Especifica el tipo de publicación',
      bookPageCount: 'Número aproximado de páginas',
      contentBalance: '¿El contenido es principalmente texto, principalmente imagen, o un balance de ambos?',
      complexLayout: '¿Incluye ensayos largos o catálogo razonado que requiera maquetación compleja?',
      bookLanguages: '¿Cuántos idiomas maneja el libro?',
      editorialCare: '¿Ya cuentan con cuidado editorial o corrección de estilo?',
      printScope: '¿El proyecto incluye solo diseño, o también preprensa y seguimiento de impresión?',
      hasPrinter: '¿Ya tienen imprenta seleccionada?',
      printRun: 'Tiraje aproximado',
      needsIsbn: '¿Necesitan gestión de ISBN o derechos?',
      brandStatus: '¿Es una identidad nueva o rediseño de una existente?',
      brandElements: '¿Qué elementos necesitan?',
      namingDefined: '¿Ya tienen naming definido?',
      brandApplications: '¿Dónde se va a aplicar la marca?',
      brandApplicationsOther: 'Otra aplicación',
      needsBrandManual: '¿Necesitan manual de marca documentado?',
      brandAudience: 'Público objetivo o audiencia principal',
      launchDate: 'Fecha ideal de lanzamiento',
      launchDatePlaceholder: 'Ej. marzo 2026 / antes de una exposición',
      budgetRange: 'Rango de presupuesto aproximado',
      budgetOptional: 'Selecciona una opción (opcional)',
      contactName: 'Nombre de contacto',
      contactEmail: 'Correo de contacto',
      decisionMaker: '¿Quién aprueba las decisiones finales?',
      feedbackMethod: '¿Cómo prefieres dar retroalimentación?',
      feedbackMethodOther: 'Especifica tu preferencia',
      needsMaintenance: '¿Vas a necesitar mantenimiento o actualizaciones después de entregado el proyecto?',
      hasTechnicalKnowledge: '¿Alguien de tu equipo tiene conocimientos técnicos?',
    },
    errors: {
      required: 'Este campo es obligatorio.',
      select: 'Selecciona una opción.',
      services: 'Selecciona al menos un servicio.',
      siteTypeOther: 'Describe el tipo de sitio.',
      publicationTypeOther: 'Describe el tipo de publicación.',
      url: 'Ingresa un enlace válido (incluye https://).',
      email: 'Ingresa un correo válido.',
      feedbackOther: 'Describe tu preferencia.',
    },
    options: {
      services: [...OPTION_VALUES.services],
      siteTypes: [...OPTION_VALUES.siteTypes],
      siteStatus: [...OPTION_VALUES.siteStatus],
      pageCounts: [...OPTION_VALUES.pageCounts],
      yesNoUnsure: [...OPTION_VALUES.yesNoUnsure],
      yesNo: [...OPTION_VALUES.yesNo],
      updateFrequency: [...OPTION_VALUES.updateFrequency],
      features: [...OPTION_VALUES.features],
      brandIdentity: [...OPTION_VALUES.brandIdentity],
      contentReadiness: [...OPTION_VALUES.contentReadiness],
      publicationTypes: [...OPTION_VALUES.publicationTypes],
      contentBalance: [...OPTION_VALUES.contentBalance],
      bookLanguages: [...OPTION_VALUES.bookLanguages],
      editorialCare: [...OPTION_VALUES.editorialCare],
      printScope: [...OPTION_VALUES.printScope],
      brandStatus: [...OPTION_VALUES.brandStatus],
      brandElements: [
        'Logotipo',
        'Paleta de color',
        'Tipografía',
      ],
      namingDefined: [...OPTION_VALUES.namingDefined],
      brandApplications: [...OPTION_VALUES.brandApplications],
      feedbackMethods: [...OPTION_VALUES.feedbackMethods],
      siteSections: {
        Portafolio: [
          'Inicio',
          'Sobre mí / Bio',
          'Trabajos / Proyectos',
          'Proceso',
          'Contacto',
          'Prensa / Menciones',
          'CV / Currículum',
          'Otro',
        ],
        'Sitio institucional': [
          'Inicio',
          'Sobre nosotros',
          'Programas / Actividades',
          'Equipo',
          'Exposiciones / Eventos',
          'Historia',
          'Prensa',
          'Contacto',
          'Convocatorias',
          'Donaciones / Apoyo',
          'Otro',
        ],
        Editorial: [
          'Inicio',
          'Catálogo / Publicaciones',
          'Sobre la editorial',
          'Autores',
          'Dónde comprar',
          'Blog / Novedades',
          'Contacto',
          'Distribución',
          'Otro',
        ],
        'Tienda en línea': [
          'Inicio',
          'Catálogo de productos',
          'Ficha de producto',
          'Carrito / Checkout',
          'Sobre la marca',
          'Envíos y devoluciones',
          'Contacto',
          'Cuenta de usuario',
          'Otro',
        ],
        'Landing page': [
          'Hero / Encabezado',
          'Sobre el proyecto',
          'Características / Beneficios',
          'Testimonios',
          'Llamado a la acción',
          'Preguntas frecuentes',
          'Contacto',
          'Otro',
        ],
      },
      portfolioProjectCounts: [...OPTION_VALUES.portfolioProjectCounts],
      portfolioEntryFields: [...OPTION_VALUES.portfolioEntryFields],
    },
  },
  en: {
    brand: 'volc4n',
    requiredMark: '*',
    selectOption: 'Select an option',
    submit: 'Submit brief',
    submitting: 'Sending…',
    confirmation: 'Thank you. We received your information and will be in touch soon.',
    submitError: 'We could not submit the form. Please try again.',
    emailDidYouMean: 'Did you mean {email}?',
    langEs: 'ES',
    langEn: 'EN',
    sections: {
      web: 'About the website',
      book: 'About the book',
      brand: 'About the brand identity',
      logistics: 'Logistics',
      support: 'Ongoing support',
    },
    applicationGroups: {
      print: 'Print and stationery',
      digital: 'Digital',
      space: 'Physical spaces and exhibition',
      merch: 'Merchandising and objects',
    },
    fields: {
      services: 'Which services are you interested in?',
      organizationName: 'Organization or project name',
      organizationDescription: 'What do you do?',
      siteType: 'What kind of site do you need?',
      siteTypeOther: 'Specify the site type',
      siteStatus: 'Is it a new site or a redesign?',
      currentSiteUrl: 'Current site link',
      references: 'References or sites you like',
      mainGoal: 'What is the main goal of the site?',
      pageCount: 'Approximate number of pages or sections',
      siteSections: 'Which sections would you like to include?',
      siteSectionsOther: 'Other section',
      portfolioProjectCount: 'About how many projects do you want to include at launch?',
      portfolioEntryFields: 'What information does each project need?',
      portfolioEntryFieldsOther: 'Other information',
      portfolioFilterByCategory: 'Should projects be filterable or groupable by typology?',
      needsCms: 'Do you need to update the content yourself through a CMS?',
      updateFrequency: 'How often would you update the content?',
      multilingual: 'Do you need the site in more than one language?',
      features: 'What features do you need?',
      featuresOther: 'Other feature',
      hasDomainHosting: 'Do you already have a domain and hosting?',
      brandIdentity: 'Do you already have a brand identity?',
      contentReadiness: 'Is your content ready (texts, images)?',
      publicationType: 'Publication type',
      publicationTypeOther: 'Specify the publication type',
      bookPageCount: 'Approximate number of pages',
      contentBalance: 'Is the content mostly text, mostly image, or a balance of both?',
      complexLayout: 'Does it include long essays or a raisonne that needs complex layout?',
      bookLanguages: 'How many languages does the book use?',
      editorialCare: 'Do you already have editorial care or copyediting?',
      printScope: 'Is the project design only, or also prepress and print follow-up?',
      hasPrinter: 'Do you already have a printer selected?',
      printRun: 'Approximate print run',
      needsIsbn: 'Do you need ISBN or rights management?',
      brandStatus: 'Is this a new identity or a redesign of an existing one?',
      brandElements: 'Which elements do you need?',
      namingDefined: 'Do you already have naming defined?',
      brandApplications: 'Where will the brand be applied?',
      brandApplicationsOther: 'Other application',
      needsBrandManual: 'Do you need a documented brand manual?',
      brandAudience: 'Target audience',
      launchDate: 'Ideal launch date',
      launchDatePlaceholder: 'E.g. March 2026 / before an exhibition',
      budgetRange: 'Approximate budget range',
      budgetOptional: 'Select an option (optional)',
      contactName: 'Contact name',
      contactEmail: 'Contact email',
      decisionMaker: 'Who approves final decisions?',
      feedbackMethod: 'How do you prefer to give feedback?',
      feedbackMethodOther: 'Specify your preference',
      needsMaintenance: 'Will you need maintenance or updates after delivery?',
      hasTechnicalKnowledge: 'Does anyone on your team have technical knowledge?',
    },
    errors: {
      required: 'This field is required.',
      select: 'Please select an option.',
      services: 'Select at least one service.',
      siteTypeOther: 'Please describe the site type.',
      publicationTypeOther: 'Please describe the publication type.',
      url: 'Enter a valid link (include https://).',
      email: 'Enter a valid email.',
      feedbackOther: 'Please describe your preference.',
    },
    options: {
      services: ['Website', 'Book / editorial', 'Brand identity'],
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
      publicationTypes: ['Artist book', 'Catalogue', 'Monograph', 'Independent publishing', 'Other'],
      contentBalance: ['Text', 'Image', 'Balance'],
      bookLanguages: ['1', '2', '3', 'More than 3'],
      editorialCare: ['Yes, we already have it', 'No, we need it', 'Not sure'],
      printScope: ['Design and final file only', 'Design + prepress + print follow-up', 'Not sure'],
      brandStatus: ['New', 'Redesign'],
      brandElements: [
        'Logo',
        'Color palette',
        'Typography',
      ],
      namingDefined: ['Yes', 'No, we also need help with the name'],
      brandApplications: [
        'Business cards',
        'Letterhead stationery',
        'Invitations',
        'Hand programs',
        'Gallery brochures',
        'Social media',
        'Email signature',
        'Newsletter',
        'Presentation deck',
        'Interior signage',
        'Wall labels',
        'Wall texts',
        'T-shirts',
        'Tote bags',
        'Postcards',
        'Stickers',
        'Packaging',
        'Other',
      ],
      feedbackMethods: ['Meetings', 'Email', 'Figma comments', 'Other'],
      siteSections: {
        Portafolio: [
          'Home',
          'About me / Bio',
          'Work / Projects',
          'Process',
          'Contact',
          'Press / Mentions',
          'CV / Resume',
          'Other',
        ],
        'Sitio institucional': [
          'Home',
          'About us',
          'Programs / Activities',
          'Team',
          'Exhibitions / Events',
          'History',
          'Press',
          'Contact',
          'Open calls',
          'Donations / Support',
          'Other',
        ],
        Editorial: [
          'Home',
          'Catalogue / Publications',
          'About the publisher',
          'Authors',
          'Where to buy',
          'Blog / News',
          'Contact',
          'Distribution',
          'Other',
        ],
        'Tienda en línea': [
          'Home',
          'Product catalogue',
          'Product page',
          'Cart / Checkout',
          'About the brand',
          'Shipping & returns',
          'Contact',
          'User account',
          'Other',
        ],
        'Landing page': [
          'Hero / Header',
          'About the project',
          'Features / Benefits',
          'Testimonials',
          'Call to action',
          'FAQ',
          'Contact',
          'Other',
        ],
      },
      portfolioProjectCounts: ['1–5', '6–15', '16–30', 'More than 30'],
      portfolioEntryFields: [
        'Project title',
        'Client',
        'Year',
        'Category / Project type',
        'Short description',
        'Long description',
        'Image gallery',
        'Video',
        'Role / Credits',
        'Tools or techniques used',
        'External link',
        'Mark as featured project',
        'Other',
      ],
    },
  },
}
