import { createClient } from '@sanity/client'
import nodemailer from 'nodemailer'

declare const process: { env: Record<string, string | undefined> }

const SERVICE_WEB = 'Sitio web'
const SERVICE_BOOK = 'Libro/editorial'
const SERVICE_BRAND = 'Identidad de marca'
const BRAND_NEEDS_DESIGN = 'No, hay que diseñarla'
const INTAKE_TO_EMAIL = 'andrea@volc4n.com'
const DEFAULT_SMTP_HOST = 'smtp.gmail.com'
const DEFAULT_SMTP_PORT = 465

const SITE_SECTION_LABELS_ES: Record<string, Record<string, string>> = {
  Portafolio: {
    home: 'Inicio',
    'about-bio': 'Sobre mí / Bio',
    works: 'Trabajos / Proyectos',
    process: 'Proceso',
    contact: 'Contacto',
    press: 'Prensa / Menciones',
    cv: 'CV / Currículum',
    other: 'Otro',
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
    other: 'Otro',
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
    other: 'Otro',
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
    other: 'Otro',
  },
  'Landing page': {
    hero: 'Hero / Encabezado',
    'about-project': 'Sobre el proyecto',
    'features-benefits': 'Características / Beneficios',
    testimonials: 'Testimonios',
    cta: 'Llamado a la acción',
    faq: 'Preguntas frecuentes',
    contact: 'Contacto',
    other: 'Otro',
  },
}

type IntakeBody = {
  services?: string[]
  organizationName?: string
  organizationDescription?: string
  siteType?: string
  siteTypeOther?: string
  siteStatus?: string
  currentSiteUrl?: string
  references?: string
  mainGoal?: string
  pageCount?: string
  siteSections?: string[]
  siteSectionsOther?: string
  portfolioProjectCount?: string
  portfolioEntryFields?: string[]
  portfolioEntryFieldsOther?: string
  portfolioFilterByCategory?: string
  needsCms?: string
  updateFrequency?: string
  multilingual?: string
  features?: string[]
  featuresOther?: string
  hasDomainHosting?: string
  brandIdentity?: string
  contentReadiness?: string
  needsContentProduction?: string
  publicationType?: string
  publicationTypeOther?: string
  bookPageCount?: string
  contentBalance?: string
  complexLayout?: string
  bookLanguages?: string
  editorialCare?: string
  printScope?: string
  hasPrinter?: string
  printRun?: string
  needsIsbn?: string
  brandStatus?: string
  brandElements?: string[]
  namingDefined?: string
  brandApplications?: string[]
  brandApplicationsOther?: string
  needsBrandManual?: string
  brandAudience?: string
  launchDate?: string
  budgetRange?: string
  contactName?: string
  contactEmail?: string
  decisionMaker?: string
  feedbackMethod?: string
  feedbackMethodOther?: string
  needsMaintenance?: string
  hasTechnicalKnowledge?: string
  website?: string
  locale?: string
}

type EmailField = { label: string; value: string }
type EmailSection = { title: string; fields: EmailField[] }

function isFilled(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function hasService(services: string[], service: string) {
  return services.includes(service)
}

function field(label: string, value: unknown): EmailField | null {
  if (Array.isArray(value)) {
    if (!value.length) return null
    return { label, value: value.join(', ') }
  }
  if (typeof value === 'string' && value.trim()) return { label, value: value.trim() }
  return null
}

function formatSiteSections(
  siteType: string | undefined,
  sections: string[] | undefined,
): string | undefined {
  if (!siteType || !sections?.length) return undefined
  const labels = SITE_SECTION_LABELS_ES[siteType]
  if (!labels) return sections.join(', ')
  return sections.map((value) => labels[value] ?? value).join(', ')
}

function buildEmailContent(body: IntakeBody, services: string[]) {
  const headerFields = [
    field('Fecha', new Date().toISOString()),
    field('Idioma del formulario', body.locale || 'es'),
    field('Servicios', services),
  ].filter((item): item is EmailField => item !== null)

  const sections: EmailSection[] = []

  const pushSection = (title: string, rows: Array<EmailField | null>) => {
    const fields = rows.filter((item): item is EmailField => item !== null)
    if (!fields.length) return
    sections.push({ title, fields })
  }

  pushSection('Contacto', [
    field('Nombre', body.contactName),
    field('Correo', body.contactEmail),
    field('Quién aprueba', body.decisionMaker),
    field('Retroalimentación', body.feedbackMethod),
    field('Retroalimentación (otro)', body.feedbackMethodOther),
    field('Fecha ideal', body.launchDate),
    field('Presupuesto', body.budgetRange),
    field('Mantenimiento', body.needsMaintenance),
    field('Conocimientos técnicos', body.hasTechnicalKnowledge),
  ])

  if (hasService(services, SERVICE_WEB)) {
    pushSection('Sitio web', [
      field('Organización / proyecto', body.organizationName),
      field('A qué se dedican', body.organizationDescription),
      field('Tipo de sitio', body.siteType),
      field('Tipo de sitio (otro)', body.siteTypeOther),
      field('Nuevo o rediseño', body.siteStatus),
      field('Sitio actual', body.currentSiteUrl),
      field('Referencias', body.references),
      field('Objetivo', body.mainGoal),
      field('Páginas / secciones', body.pageCount),
      field('Secciones a incluir', formatSiteSections(body.siteType, body.siteSections)),
      field('Secciones (otro)', body.siteSectionsOther),
      field('Proyectos al inicio', body.portfolioProjectCount),
      field('Info por proyecto', body.portfolioEntryFields),
      field('Info por proyecto (otro)', body.portfolioEntryFieldsOther),
      field('Filtro por tipología', body.portfolioFilterByCategory),
      field('CMS', body.needsCms),
      field('Frecuencia de actualización', body.updateFrequency),
      field('Multilingüe', body.multilingual),
      field('Funcionalidades', body.features),
      field('Funcionalidades (otro)', body.featuresOther),
      field('Dominio y hosting', body.hasDomainHosting),
      field('Identidad de marca (web)', body.brandIdentity),
      field('Contenidos listos', body.contentReadiness),
    ])
  }

  if (hasService(services, SERVICE_BOOK)) {
    pushSection('Libro / editorial', [
      field('Tipo de publicación', body.publicationType),
      field('Tipo (otro)', body.publicationTypeOther),
      field('Páginas', body.bookPageCount),
      field('Balance de contenido', body.contentBalance),
      field('Maquetación compleja', body.complexLayout),
      field('Idiomas', body.bookLanguages),
      field('Cuidado editorial', body.editorialCare),
      field('Alcance de impresión', body.printScope),
      field('Imprenta seleccionada', body.hasPrinter),
      field('Tiraje', body.printRun),
      field('ISBN / derechos', body.needsIsbn),
    ])
  }

  if (
    hasService(services, SERVICE_BRAND) ||
    body.brandIdentity === BRAND_NEEDS_DESIGN
  ) {
    pushSection('Identidad de marca', [
      field('Nueva o rediseño', body.brandStatus),
      field('Elementos', body.brandElements),
      field('Naming', body.namingDefined),
      field('Aplicaciones', body.brandApplications),
      field('Aplicaciones (otro)', body.brandApplicationsOther),
      field('Manual de marca', body.needsBrandManual),
      field('Audiencia', body.brandAudience),
    ])
  }

  return { headerFields, sections }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatEmailText(body: IntakeBody, services: string[]) {
  const { headerFields, sections } = buildEmailContent(body, services)
  const blocks: string[] = [
    'Nuevo brief recibido desde volc4n.com/quote',
    ...headerFields.map((item) => `${item.label}: ${item.value}`),
  ]

  for (const section of sections) {
    blocks.push('', `— ${section.title} —`)
    for (const item of section.fields) {
      blocks.push(`${item.label}: ${item.value}`)
    }
  }

  return blocks.join('\n')
}

function formatEmailHtml(body: IntakeBody, services: string[]) {
  const { headerFields, sections } = buildEmailContent(body, services)
  const font =
    "font-family: system-ui, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #111111;"

  const renderField = (item: EmailField) =>
    `<tr>
      <td style="padding: 0 0 14px 0; ${font}">
        <div style="font-weight: 700; margin: 0 0 2px 0;">${escapeHtml(item.label)}</div>
        <div style="font-weight: 400; padding-left: 12px; white-space: pre-wrap;">${escapeHtml(item.value)}</div>
      </td>
    </tr>`

  const headerHtml = headerFields.map(renderField).join('')
  const sectionsHtml = sections
    .map(
      (section) =>
        `<tr>
          <td style="padding: 18px 0 10px 0; ${font}">
            <div style="font-weight: 700;">— ${escapeHtml(section.title)} —</div>
          </td>
        </tr>
        ${section.fields.map(renderField).join('')}`,
    )
    .join('')

  return `<!DOCTYPE html>
<html>
  <body style="margin: 0; padding: 0; background: #ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 640px; margin: 0 auto; padding: 24px 16px; ${font}">
      <tr>
        <td style="padding: 0 0 16px 0; ${font}">
          Nuevo brief recibido desde volc4n.com/quote
        </td>
      </tr>
      ${headerHtml}
      ${sectionsHtml}
    </table>
  </body>
</html>`
}

function smtpConfig() {
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS
  if (!user || !pass) return null

  const port = Number(process.env.SMTP_PORT) || DEFAULT_SMTP_PORT
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase()
  const secure =
    secureEnv === 'true' || secureEnv === '1'
      ? true
      : secureEnv === 'false' || secureEnv === '0'
        ? false
        : port === 465

  return {
    host: process.env.SMTP_HOST?.trim() || DEFAULT_SMTP_HOST,
    port,
    secure,
    user,
    pass,
  }
}

async function sendIntakeEmail(body: IntakeBody, services: string[]) {
  const smtp = smtpConfig()
  if (!smtp) {
    throw new Error('Missing SMTP_USER or SMTP_PASS')
  }

  const from =
    process.env.INTAKE_FROM_EMAIL?.trim() || smtp.user
  const to = process.env.INTAKE_TO_EMAIL?.trim() || INTAKE_TO_EMAIL
  const contactName = body.contactName?.trim() || 'Sin nombre'
  const contactEmail = body.contactEmail?.trim().toLowerCase() || ''
  const subjectParts = [
    'Brief volc4n',
    services.join(', ') || 'sin servicio',
    contactName,
  ]

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  })

  await transporter.sendMail({
    from,
    to,
    replyTo: contactEmail || undefined,
    subject: subjectParts.join(' · '),
    text: formatEmailText(body, services),
    html: formatEmailHtml(body, services),
  })
}

export default async function handler(
  req: { method?: string; body?: IntakeBody | string },
  res: {
    status: (code: number) => { json: (body: unknown) => void }
    json: (body: unknown) => void
  },
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const raw = req.body ?? {}
  const body: IntakeBody =
    typeof raw === 'string' ? (JSON.parse(raw) as IntakeBody) : (raw as IntakeBody)

  if (typeof body.website === 'string' && body.website.trim()) {
    res.status(200).json({ ok: true })
    return
  }

  const token = process.env.SANITY_API_WRITE_TOKEN
  const projectId = process.env.VITE_SANITY_PROJECT_ID || '3pjczo8m'
  const dataset = process.env.VITE_SANITY_DATASET || 'production'

  if (!smtpConfig()) {
    res.status(500).json({ error: 'Server misconfigured' })
    return
  }

  const services = Array.isArray(body.services) ? body.services.filter(Boolean) : []
  const wantsWeb = hasService(services, SERVICE_WEB)
  const wantsBook = hasService(services, SERVICE_BOOK)
  const wantsBrand =
    hasService(services, SERVICE_BRAND) || body.brandIdentity === BRAND_NEEDS_DESIGN

  if (!services.length) {
    res.status(400).json({ error: 'Missing required fields', field: 'services' })
    return
  }

  const sharedRequired = [
    'contactName',
    'contactEmail',
    'needsMaintenance',
  ] as const

  for (const key of sharedRequired) {
    if (!isFilled(body[key])) {
      res.status(400).json({ error: 'Missing required fields', field: key })
      return
    }
  }

  if (wantsWeb) {
    const webRequired = [
      'organizationName',
      'organizationDescription',
      'siteType',
      'siteStatus',
      'mainGoal',
      'pageCount',
      'needsCms',
      'multilingual',
      'hasDomainHosting',
      'brandIdentity',
      'contentReadiness',
    ] as const
    for (const key of webRequired) {
      if (!isFilled(body[key])) {
        res.status(400).json({ error: 'Missing required fields', field: key })
        return
      }
    }
  }

  if (wantsBook) {
    const bookRequired = [
      'publicationType',
      'bookPageCount',
      'contentBalance',
      'bookLanguages',
      'editorialCare',
      'printScope',
      'hasPrinter',
      'needsIsbn',
    ] as const
    for (const key of bookRequired) {
      if (!isFilled(body[key])) {
        res.status(400).json({ error: 'Missing required fields', field: key })
        return
      }
    }
  }

  if (wantsBrand) {
    if (!isFilled(body.brandStatus) || !isFilled(body.namingDefined) || !isFilled(body.needsBrandManual)) {
      res.status(400).json({ error: 'Missing required fields', field: 'brand' })
      return
    }
    if (!Array.isArray(body.brandElements) || !body.brandElements.length) {
      res.status(400).json({ error: 'Missing required fields', field: 'brandElements' })
      return
    }
  }

  try {
    await sendIntakeEmail(body, services)

    if (token) {
      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2025-01-01',
        token,
        useCdn: false,
      })

      await client.create({
        _type: 'clientIntake',
        submittedAt: new Date().toISOString(),
        locale: body.locale || 'es',
        services,
        organizationName: body.organizationName?.trim() || undefined,
        organizationDescription: body.organizationDescription?.trim() || undefined,
        siteType: body.siteType || undefined,
        siteTypeOther: body.siteTypeOther?.trim() || undefined,
        siteStatus: body.siteStatus || undefined,
        currentSiteUrl: body.currentSiteUrl?.trim() || undefined,
        references: body.references?.trim() || undefined,
        mainGoal: body.mainGoal?.trim() || undefined,
        pageCount: body.pageCount || undefined,
        siteSections:
          Array.isArray(body.siteSections) && body.siteSections.length
            ? body.siteSections
            : undefined,
        siteSectionsOther: body.siteSectionsOther?.trim() || undefined,
        portfolioProjectCount: body.portfolioProjectCount || undefined,
        portfolioEntryFields:
          Array.isArray(body.portfolioEntryFields) && body.portfolioEntryFields.length
            ? body.portfolioEntryFields
            : undefined,
        portfolioEntryFieldsOther: body.portfolioEntryFieldsOther?.trim() || undefined,
        portfolioFilterByCategory: body.portfolioFilterByCategory || undefined,
        needsCms: body.needsCms || undefined,
        updateFrequency: body.updateFrequency || undefined,
        multilingual: body.multilingual || undefined,
        features: Array.isArray(body.features) && body.features.length ? body.features : undefined,
        featuresOther: body.featuresOther?.trim() || undefined,
        hasDomainHosting: body.hasDomainHosting || undefined,
        brandIdentity: body.brandIdentity || undefined,
        contentReadiness: body.contentReadiness || undefined,
        needsContentProduction: body.needsContentProduction || undefined,
        publicationType: body.publicationType || undefined,
        publicationTypeOther: body.publicationTypeOther?.trim() || undefined,
        bookPageCount: body.bookPageCount?.trim() || undefined,
        contentBalance: body.contentBalance || undefined,
        complexLayout: body.complexLayout || undefined,
        bookLanguages: body.bookLanguages || undefined,
        editorialCare: body.editorialCare || undefined,
        printScope: body.printScope || undefined,
        hasPrinter: body.hasPrinter || undefined,
        printRun: body.printRun?.trim() || undefined,
        needsIsbn: body.needsIsbn || undefined,
        brandStatus: body.brandStatus || undefined,
        brandElements:
          Array.isArray(body.brandElements) && body.brandElements.length
            ? body.brandElements
            : undefined,
        namingDefined: body.namingDefined || undefined,
        brandApplications:
          Array.isArray(body.brandApplications) && body.brandApplications.length
            ? body.brandApplications
            : undefined,
        brandApplicationsOther: body.brandApplicationsOther?.trim() || undefined,
        needsBrandManual: body.needsBrandManual || undefined,
        brandAudience: body.brandAudience?.trim() || undefined,
        launchDate: body.launchDate?.trim() || undefined,
        budgetRange: body.budgetRange || undefined,
        contactName: body.contactName!.trim(),
        contactEmail: body.contactEmail!.trim().toLowerCase(),
        decisionMaker: body.decisionMaker?.trim() || undefined,
        feedbackMethod: body.feedbackMethod,
        feedbackMethodOther: body.feedbackMethodOther?.trim() || undefined,
        needsMaintenance: body.needsMaintenance,
        hasTechnicalKnowledge: body.hasTechnicalKnowledge,
      })
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to save submission' })
  }
}
