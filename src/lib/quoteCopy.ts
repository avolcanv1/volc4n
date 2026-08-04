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
    'Papelería',
    'Manual de marca',
    'Aplicaciones específicas',
    'Otro',
  ],
  namingDefined: ['Sí', 'No, también necesitamos ayuda con el nombre'],
  brandApplications: [
    'Tarjetas de presentación',
    'Papelería membretada',
    'Invitaciones',
    'Programas de mano / folletos de sala',
    'Sitio web',
    'Redes sociales',
    'Firma de correo electrónico',
    'Newsletter',
    'Señalética interior',
    'Cédulas o textos de pared',
    'Vinilos o gráfica de gran formato',
    'Montaje de exposición',
    'Portada de catálogo o libro',
    'Plantilla editorial',
    'Playeras o bolsas de tela',
    'Postales o stickers',
    'Empaque',
    'Presentaciones',
    'Certificados o reconocimientos',
    'Gafetes o credenciales',
    'Otro',
  ],
  budgetRanges: [
    'Menos de $20,000 MXN',
    '$20,000 – $50,000 MXN',
    '$50,000 – $100,000 MXN',
    '$100,000 – $200,000 MXN',
    '$200,000 – $400,000 MXN',
    'Más de $400,000 MXN',
    'Prefiero no decirlo',
  ],
  feedbackMethods: ['Reuniones', 'Correo', 'Comentarios en Figma', 'Otro'],
} as const

export const BRAND_APPLICATION_GROUPS = [
  {
    key: 'print',
    values: [
      'Tarjetas de presentación',
      'Papelería membretada',
      'Invitaciones',
      'Programas de mano / folletos de sala',
    ],
  },
  {
    key: 'digital',
    values: ['Sitio web', 'Redes sociales', 'Firma de correo electrónico', 'Newsletter'],
  },
  {
    key: 'space',
    values: [
      'Señalética interior',
      'Cédulas o textos de pared',
      'Vinilos o gráfica de gran formato',
      'Montaje de exposición',
    ],
  },
  {
    key: 'publications',
    values: ['Portada de catálogo o libro', 'Plantilla editorial'],
  },
  {
    key: 'merch',
    values: ['Playeras o bolsas de tela', 'Postales o stickers', 'Empaque'],
  },
  {
    key: 'institutional',
    values: ['Presentaciones', 'Certificados o reconocimientos', 'Gafetes o credenciales'],
  },
] as const

/** Spanish help copy for QuestionHelp (?). Always Spanish regardless of locale. */
export const QUESTION_HELP = {
  brandIdentity:
    'La identidad de marca incluye tu logotipo, paleta de colores y tipografía. Si no cuentas con ella, la podemos diseñar como parte del proyecto.',
  needsCms: 'Un CMS te permite editar textos e imágenes del sitio sin necesitar a un desarrollador.',
  hasDomainHosting:
    'El dominio es la dirección de tu sitio (ej. tuestudio.com) y el hosting es donde vive el sitio en internet. Si no los tienes, podemos ayudarte a conseguirlos.',
  needsContentProduction:
    'Esto se refiere a tomar fotos nuevas o escribir textos para el sitio, en caso de que no tengas material propio listo para usar.',
  editorialCare:
    'El cuidado editorial es la revisión de estilo, consistencia y coherencia del texto antes de maquetarlo.',
  printScope:
    'Preprensa es la preparación técnica del archivo final para impresión (perfiles de color, sangrados, marcas de corte).',
  needsIsbn: 'El ISBN es el número que identifica una publicación para su venta y distribución formal.',
  needsBrandManual:
    'Un manual de marca documenta cómo debe usarse tu identidad (logo, colores, tipografía) para mantener consistencia en cualquier aplicación futura.',
  needsMaintenance:
    'El mantenimiento incluye actualizaciones de contenido, correcciones o cambios pequeños después de que el proyecto esté finalizado.',
} as const

export type QuestionHelpKey = keyof typeof QUESTION_HELP

type QuoteCopy = {
  brand: string
  requiredMark: string
  selectOption: string
  submit: string
  submitting: string
  confirmation: string
  submitError: string
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
    publications: string
    merch: string
    institutional: string
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
    needsCms: string
    updateFrequency: string
    multilingual: string
    features: string
    featuresOther: string
    hasDomainHosting: string
    brandIdentity: string
    contentReadiness: string
    needsContentProduction: string
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
    budgetRanges: string[]
    feedbackMethods: string[]
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
      publications: 'Publicaciones',
      merch: 'Merchandising y objetos',
      institutional: 'Institucional',
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
      needsCms: '¿Necesitas actualizar el contenido tú mismo a través de un CMS?',
      updateFrequency: '¿Con qué frecuencia actualizarías el contenido?',
      multilingual: '¿Necesitas el sitio en más de un idioma?',
      features: '¿Qué funcionalidades necesitas?',
      featuresOther: 'Otra funcionalidad',
      hasDomainHosting: '¿Ya tienes dominio y hosting?',
      brandIdentity: '¿Ya cuentas con identidad de marca?',
      contentReadiness: '¿Tienes los contenidos listos (textos, imágenes)?',
      needsContentProduction: '¿Necesitas producción fotográfica o de contenido?',
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
      brandApplications: 'Aplicaciones específicas (¿Dónde se va a aplicar la marca?)',
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
      brandElements: [...OPTION_VALUES.brandElements],
      namingDefined: [...OPTION_VALUES.namingDefined],
      brandApplications: [...OPTION_VALUES.brandApplications],
      budgetRanges: [...OPTION_VALUES.budgetRanges],
      feedbackMethods: [...OPTION_VALUES.feedbackMethods],
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
      publications: 'Publications',
      merch: 'Merchandising and objects',
      institutional: 'Institutional',
    },
    fields: {
      services: 'Which service(s) are you interested in?',
      organizationName: 'Organization or project name',
      organizationDescription: 'What do you do?',
      siteType: 'What kind of site do you need?',
      siteTypeOther: 'Specify the site type',
      siteStatus: 'Is it a new site or a redesign?',
      currentSiteUrl: 'Current site link',
      references: 'References or sites you like',
      mainGoal: 'What is the main goal of the site?',
      pageCount: 'Approximate number of pages or sections',
      needsCms: 'Do you need to update the content yourself through a CMS?',
      updateFrequency: 'How often would you update the content?',
      multilingual: 'Do you need the site in more than one language?',
      features: 'What features do you need?',
      featuresOther: 'Other feature',
      hasDomainHosting: 'Do you already have a domain and hosting?',
      brandIdentity: 'Do you already have a brand identity?',
      contentReadiness: 'Is your content ready (texts, images)?',
      needsContentProduction: 'Do you need photography or content production?',
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
      brandApplications: 'Specific applications (Where will the brand be used?)',
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
        'Stationery',
        'Brand manual',
        'Specific applications',
        'Other',
      ],
      namingDefined: ['Yes', 'No, we also need help with the name'],
      brandApplications: [...OPTION_VALUES.brandApplications],
      budgetRanges: [
        'Under $20,000 MXN',
        '$20,000 – $50,000 MXN',
        '$50,000 – $100,000 MXN',
        '$100,000 – $200,000 MXN',
        '$200,000 – $400,000 MXN',
        'Over $400,000 MXN',
        'Prefer not to say',
      ],
      feedbackMethods: ['Meetings', 'Email', 'Figma comments', 'Other'],
    },
  },
}
