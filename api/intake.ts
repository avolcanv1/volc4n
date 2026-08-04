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

function isFilled(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function hasService(services: string[], service: string) {
  return services.includes(service)
}

function line(label: string, value: unknown) {
  if (Array.isArray(value)) {
    if (!value.length) return null
    return `${label}: ${value.join(', ')}`
  }
  if (typeof value === 'string' && value.trim()) return `${label}: ${value.trim()}`
  return null
}

function formatEmailBody(body: IntakeBody, services: string[]) {
  const pushSection = (blocks: string[], title: string, rows: Array<string | null>) => {
    const filled = rows.filter((item): item is string => item !== null)
    if (!filled.length) return
    blocks.push('', `— ${title} —`, ...filled)
  }

  const blocks: string[] = [
    'Nuevo brief recibido desde volc4n.com/quote',
    `Fecha: ${new Date().toISOString()}`,
    `Idioma del formulario: ${body.locale || 'es'}`,
    '',
    line('Servicios', services),
  ].filter((item): item is string => item !== null)

  pushSection(blocks, 'Contacto', [
    line('Nombre', body.contactName),
    line('Correo', body.contactEmail),
    line('Quién aprueba', body.decisionMaker),
    line('Retroalimentación', body.feedbackMethod),
    line('Retroalimentación (otro)', body.feedbackMethodOther),
    line('Fecha ideal', body.launchDate),
    line('Presupuesto', body.budgetRange),
    line('Mantenimiento', body.needsMaintenance),
    line('Conocimientos técnicos', body.hasTechnicalKnowledge),
  ])

  if (hasService(services, SERVICE_WEB)) {
    pushSection(blocks, 'Sitio web', [
      line('Organización / proyecto', body.organizationName),
      line('A qué se dedican', body.organizationDescription),
      line('Tipo de sitio', body.siteType),
      line('Tipo de sitio (otro)', body.siteTypeOther),
      line('Nuevo o rediseño', body.siteStatus),
      line('Sitio actual', body.currentSiteUrl),
      line('Referencias', body.references),
      line('Objetivo', body.mainGoal),
      line('Páginas / secciones', body.pageCount),
      line('CMS', body.needsCms),
      line('Frecuencia de actualización', body.updateFrequency),
      line('Multilingüe', body.multilingual),
      line('Funcionalidades', body.features),
      line('Funcionalidades (otro)', body.featuresOther),
      line('Dominio y hosting', body.hasDomainHosting),
      line('Identidad de marca (web)', body.brandIdentity),
      line('Contenidos listos', body.contentReadiness),
      line('Producción de contenido', body.needsContentProduction),
    ])
  }

  if (hasService(services, SERVICE_BOOK)) {
    pushSection(blocks, 'Libro / editorial', [
      line('Tipo de publicación', body.publicationType),
      line('Tipo (otro)', body.publicationTypeOther),
      line('Páginas', body.bookPageCount),
      line('Balance de contenido', body.contentBalance),
      line('Maquetación compleja', body.complexLayout),
      line('Idiomas', body.bookLanguages),
      line('Cuidado editorial', body.editorialCare),
      line('Alcance de impresión', body.printScope),
      line('Imprenta seleccionada', body.hasPrinter),
      line('Tiraje', body.printRun),
      line('ISBN / derechos', body.needsIsbn),
    ])
  }

  if (
    hasService(services, SERVICE_BRAND) ||
    body.brandIdentity === BRAND_NEEDS_DESIGN
  ) {
    pushSection(blocks, 'Identidad de marca', [
      line('Nueva o rediseño', body.brandStatus),
      line('Elementos', body.brandElements),
      line('Naming', body.namingDefined),
      line('Aplicaciones', body.brandApplications),
      line('Aplicaciones (otro)', body.brandApplicationsOther),
      line('Manual de marca', body.needsBrandManual),
      line('Audiencia', body.brandAudience),
    ])
  }

  return blocks.join('\n')
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
    text: formatEmailBody(body, services),
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
      'needsContentProduction',
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
