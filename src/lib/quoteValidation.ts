import type { QuoteLocale } from './quoteCopy'
import { quoteCopy } from './quoteCopy'

export type QuotePayload = {
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

export function validateQuote(data: QuotePayload, locale: QuoteLocale): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {}
  const { errors: messages } = quoteCopy[locale]

  if (!data.organizationName.trim()) errors.organizationName = messages.required
  if (!data.organizationDescription.trim()) errors.organizationDescription = messages.required
  if (!data.siteType) errors.siteType = messages.select
  if (data.siteType === 'Otro' && !data.siteTypeOther.trim()) errors.siteTypeOther = messages.siteTypeOther
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
  if (!data.contactName.trim()) errors.contactName = messages.required
  if (!data.contactEmail.trim()) {
    errors.contactEmail = messages.required
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
    errors.contactEmail = messages.email
  }
  if (!data.needsMaintenance) errors.needsMaintenance = messages.select

  return errors
}
