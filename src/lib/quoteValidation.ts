import {
  BRAND_NEEDS_DESIGN,
  SERVICE_VALUES,
  quoteCopy,
  type QuoteLocale,
} from './quoteCopy'

export type QuotePayload = {
  services: string[]
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
  features: string[]
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
  brandElements: string[]
  namingDefined: string
  brandApplications: string[]
  brandApplicationsOther: string
  needsBrandManual: string
  brandAudience: string
  launchDate: string
  budgetRange: string
  contactName: string
  contactEmail: string
  decisionMaker: string
  feedbackMethod: string
  feedbackMethodOther: string
  needsMaintenance: string
  hasTechnicalKnowledge: string
  website: string
}

export type QuoteFieldErrors = Partial<Record<keyof QuotePayload, string>>

export function hasService(services: string[], service: string) {
  return services.includes(service)
}

export function validateQuote(data: QuotePayload, locale: QuoteLocale): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {}
  const { errors: messages } = quoteCopy[locale]
  const wantsWeb = hasService(data.services, SERVICE_VALUES.web)
  const wantsBook = hasService(data.services, SERVICE_VALUES.book)
  const wantsBrand =
    hasService(data.services, SERVICE_VALUES.brand) || data.brandIdentity === BRAND_NEEDS_DESIGN

  if (!data.organizationName.trim()) errors.organizationName = messages.required
  if (!data.organizationDescription.trim()) errors.organizationDescription = messages.required
  if (!data.services.length) errors.services = messages.services

  if (wantsWeb) {
    if (!data.siteType) errors.siteType = messages.select
    if (data.siteType === 'Otro' && !data.siteTypeOther.trim()) {
      errors.siteTypeOther = messages.siteTypeOther
    }
    if (!data.siteStatus) errors.siteStatus = messages.select
    if (data.siteStatus === 'Rediseño' && data.currentSiteUrl.trim()) {
      try {
        new URL(data.currentSiteUrl.trim())
      } catch {
        errors.currentSiteUrl = messages.url
      }
    }
    if (!data.mainGoal.trim()) errors.mainGoal = messages.required
    if (!data.pageCount) errors.pageCount = messages.select
    if (!data.needsCms) errors.needsCms = messages.select
    if (
      (data.needsCms === 'Sí' || data.needsCms === 'No estoy seguro') &&
      !data.updateFrequency
    ) {
      errors.updateFrequency = messages.select
    }
    if (!data.multilingual) errors.multilingual = messages.select
    if (!data.hasDomainHosting) errors.hasDomainHosting = messages.select
    if (!data.brandIdentity) errors.brandIdentity = messages.select
    if (!data.contentReadiness) errors.contentReadiness = messages.select
    if (!data.needsContentProduction) errors.needsContentProduction = messages.select
  }

  if (wantsBook) {
    if (!data.publicationType) errors.publicationType = messages.select
    if (data.publicationType === 'Otro' && !data.publicationTypeOther.trim()) {
      errors.publicationTypeOther = messages.publicationTypeOther
    }
    if (!data.bookPageCount.trim()) errors.bookPageCount = messages.required
    if (!data.contentBalance) errors.contentBalance = messages.select
    if (!data.bookLanguages) errors.bookLanguages = messages.select
    if (!data.editorialCare) errors.editorialCare = messages.select
    if (!data.printScope) errors.printScope = messages.select
    if (!data.hasPrinter) errors.hasPrinter = messages.select
    if (!data.needsIsbn) errors.needsIsbn = messages.select
  }

  if (wantsBrand) {
    if (!data.brandStatus) errors.brandStatus = messages.select
    if (!data.brandElements.length) errors.brandElements = messages.select
    if (!data.namingDefined) errors.namingDefined = messages.select
    if (!data.needsBrandManual) errors.needsBrandManual = messages.select
  }

  if (!data.contactName.trim()) errors.contactName = messages.required
  if (!data.contactEmail.trim()) {
    errors.contactEmail = messages.required
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
    errors.contactEmail = messages.email
  }
  if (!data.needsMaintenance) errors.needsMaintenance = messages.select

  return errors
}
