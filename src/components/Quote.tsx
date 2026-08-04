import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { getBudgetRangeOptions } from '../lib/budgetRanges'
import {
  BRAND_APPLICATION_GROUPS,
  BRAND_NEEDS_DESIGN,
  OPTION_VALUES,
  SERVICE_VALUES,
  quoteCopy,
  type QuestionHelpKey,
  type QuoteLocale,
} from '../lib/quoteCopy'
import {
  hasService,
  validateQuote,
  type QuoteFieldErrors,
  type QuotePayload,
} from '../lib/quoteValidation'
import { QuestionHelp } from './QuestionHelp'
import { ThemeToggle } from './ThemeToggle'
import './Quote.css'

const INITIAL: QuotePayload = {
  services: [],
  organizationName: '',
  organizationDescription: '',
  siteType: '',
  siteTypeOther: '',
  siteStatus: '',
  currentSiteUrl: '',
  references: '',
  mainGoal: '',
  pageCount: '',
  needsCms: '',
  updateFrequency: '',
  multilingual: '',
  features: [],
  featuresOther: '',
  hasDomainHosting: '',
  brandIdentity: '',
  contentReadiness: '',
  needsContentProduction: '',
  publicationType: '',
  publicationTypeOther: '',
  bookPageCount: '',
  contentBalance: '',
  complexLayout: '',
  bookLanguages: '',
  editorialCare: '',
  printScope: '',
  hasPrinter: '',
  printRun: '',
  needsIsbn: '',
  brandStatus: '',
  brandElements: [],
  namingDefined: '',
  brandApplications: [],
  brandApplicationsOther: '',
  needsBrandManual: '',
  brandAudience: '',
  launchDate: '',
  budgetRange: '',
  contactName: '',
  contactEmail: '',
  decisionMaker: '',
  feedbackMethod: '',
  feedbackMethodOther: '',
  needsMaintenance: '',
  hasTechnicalKnowledge: '',
  website: '',
}

function Required({ mark }: { mark: string }) {
  return (
    <span className="quote__required" aria-hidden="true">
      {mark}
    </span>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="quote__error">{message}</p>
}

/** Keeps the last words + * + ? together so marks never sit alone on a line. */
function QuestionLabel({
  text,
  requiredMark,
  helpKey,
  locale,
}: {
  text: string
  requiredMark?: string
  helpKey?: QuestionHelpKey
  locale?: QuoteLocale
}) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const keepCount = Math.min(Math.max(words.length, 1), 3)
  const headWords = words.slice(0, -keepCount)
  const tailWords = words.slice(-keepCount)
  const head = headWords.join(' ')
  const tail = tailWords.join(' ')

  return (
    <>
      {head ? `${head} ` : null}
      <span className="quote__label-end">
        {tail}
        {requiredMark ? <Required mark={requiredMark} /> : null}
        {helpKey && locale ? <QuestionHelp helpKey={helpKey} locale={locale} /> : null}
      </span>
    </>
  )
}

function mapOptions(values: readonly string[], labels: string[]) {
  return values.map((value, index) => ({ value, label: labels[index] ?? value }))
}

function OrganizationFields({
  fields,
  requiredMark,
  organizationName,
  organizationDescription,
  errors,
  onChange,
}: {
  fields: { organizationName: string; organizationDescription: string }
  requiredMark: string
  organizationName: string
  organizationDescription: string
  errors: QuoteFieldErrors
  onChange: (key: 'organizationName' | 'organizationDescription', value: string) => void
}) {
  return (
    <>
      <div className="quote__field">
        <label className="quote__label" htmlFor="organizationName">
          <QuestionLabel text={fields.organizationName} requiredMark={requiredMark} />
        </label>
        <input
          id="organizationName"
          className="quote__underline"
          type="text"
          value={organizationName}
          onChange={(event) => onChange('organizationName', event.target.value)}
          aria-invalid={Boolean(errors.organizationName)}
        />
        <FieldError message={errors.organizationName} />
      </div>

      <div className="quote__field">
        <label className="quote__label" htmlFor="organizationDescription">
          <QuestionLabel text={fields.organizationDescription} requiredMark={requiredMark} />
        </label>
        <textarea
          id="organizationDescription"
          className="quote__box"
          value={organizationDescription}
          onChange={(event) => onChange('organizationDescription', event.target.value)}
          aria-invalid={Boolean(errors.organizationDescription)}
        />
        <FieldError message={errors.organizationDescription} />
      </div>
    </>
  )
}

export function Quote() {
  const { isDark } = useTheme()
  const [locale, setLocale] = useState<QuoteLocale>('es')
  const [form, setForm] = useState<QuotePayload>(INITIAL)
  const [errors, setErrors] = useState<QuoteFieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  /** True only when Identidad de marca was auto-added via BRAND_NEEDS_DESIGN. */
  const brandAutoAddedRef = useRef(false)

  const t = quoteCopy[locale]

  const labels = useMemo(
    () => ({
      services: mapOptions(OPTION_VALUES.services, t.options.services),
      siteTypes: mapOptions(OPTION_VALUES.siteTypes, t.options.siteTypes),
      siteStatus: mapOptions(OPTION_VALUES.siteStatus, t.options.siteStatus),
      pageCounts: mapOptions(OPTION_VALUES.pageCounts, t.options.pageCounts),
      yesNoUnsure: mapOptions(OPTION_VALUES.yesNoUnsure, t.options.yesNoUnsure),
      yesNo: mapOptions(OPTION_VALUES.yesNo, t.options.yesNo),
      updateFrequency: mapOptions(OPTION_VALUES.updateFrequency, t.options.updateFrequency),
      features: mapOptions(OPTION_VALUES.features, t.options.features),
      brandIdentity: mapOptions(OPTION_VALUES.brandIdentity, t.options.brandIdentity),
      contentReadiness: mapOptions(OPTION_VALUES.contentReadiness, t.options.contentReadiness),
      publicationTypes: mapOptions(OPTION_VALUES.publicationTypes, t.options.publicationTypes),
      contentBalance: mapOptions(OPTION_VALUES.contentBalance, t.options.contentBalance),
      bookLanguages: mapOptions(OPTION_VALUES.bookLanguages, t.options.bookLanguages),
      editorialCare: mapOptions(OPTION_VALUES.editorialCare, t.options.editorialCare),
      printScope: mapOptions(OPTION_VALUES.printScope, t.options.printScope),
      brandStatus: mapOptions(OPTION_VALUES.brandStatus, t.options.brandStatus),
      brandElements: mapOptions(OPTION_VALUES.brandElements, t.options.brandElements),
      namingDefined: mapOptions(OPTION_VALUES.namingDefined, t.options.namingDefined),
      brandApplications: mapOptions(OPTION_VALUES.brandApplications, t.options.brandApplications),
    }),
    [t],
  )

  function clearError(key: keyof QuotePayload) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    clearError(key)
  }

  function toggleInArray(key: 'services' | 'features' | 'brandElements' | 'brandApplications', value: string) {
    setForm((current) => {
      const list = current[key]
      const has = list.includes(value)
      // Manual brand toggle: treat as intentional, never auto-remove later.
      if (key === 'services' && value === SERVICE_VALUES.brand) {
        brandAutoAddedRef.current = false
      }
      return {
        ...current,
        [key]: has ? list.filter((item) => item !== value) : [...list, value],
      }
    })
    clearError(key)
  }

  function updateBrandIdentity(value: string) {
    const shouldAutoAdd =
      value === BRAND_NEEDS_DESIGN && !form.services.includes(SERVICE_VALUES.brand)
    const shouldAutoRemove =
      value !== BRAND_NEEDS_DESIGN && brandAutoAddedRef.current

    setForm((current) => {
      const next = { ...current, brandIdentity: value }
      if (value === BRAND_NEEDS_DESIGN && !current.services.includes(SERVICE_VALUES.brand)) {
        next.services = [...current.services, SERVICE_VALUES.brand]
      } else if (shouldAutoRemove && current.services.includes(SERVICE_VALUES.brand)) {
        next.services = current.services.filter((item) => item !== SERVICE_VALUES.brand)
      }
      return next
    })

    if (shouldAutoAdd) brandAutoAddedRef.current = true
    else if (shouldAutoRemove) brandAutoAddedRef.current = false

    clearError('brandIdentity')
    clearError('services')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    const nextErrors = validateQuote(form, locale)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })

      if (!response.ok) {
        let apiMessage = ''
        try {
          const payload = (await response.json()) as { error?: string }
          if (typeof payload.error === 'string' && payload.error.trim()) {
            apiMessage = payload.error.trim()
          }
        } catch {
          /* ignore non-JSON error bodies */
        }
        setSubmitError(apiMessage ? `${t.submitError} (${apiMessage})` : t.submitError)
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError(t.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const showWeb = hasService(form.services, SERVICE_VALUES.web)
  const showBook = hasService(form.services, SERVICE_VALUES.book)
  const showBrand = hasService(form.services, SERVICE_VALUES.brand)
  const showUpdateFrequency = form.needsCms === 'Sí' || form.needsCms === 'No estoy seguro'
  const showSiteTypeOther = form.siteType === 'Otro'
  const showCurrentUrl = form.siteStatus === 'Rediseño'
  const showFeaturesOther = form.features.includes('Otro')
  const showPublicationTypeOther = form.publicationType === 'Otro'
  const showBrandApplicationsOther = form.brandApplications.includes('Otro')

  const budgetRangeOptions = useMemo(
    () => getBudgetRangeOptions(form.services, form.bookPageCount, locale),
    [form.services, form.bookPageCount, locale],
  )

  useEffect(() => {
    if (!form.budgetRange) return
    if (budgetRangeOptions.some((option) => option.value === form.budgetRange)) return
    setForm((current) => ({ ...current, budgetRange: '' }))
  }, [budgetRangeOptions, form.budgetRange])

  return (
    <div className={`quote${isDark ? ' page--dark' : ''}`}>
      <header className="quote__top">
        <Link to="/" className="quote__brand">
          {t.brand}
        </Link>
        <div className="quote__controls">
          <div className="quote__lang" role="group" aria-label="Language">
            <button
              type="button"
              className={`quote__lang-btn${locale === 'es' ? ' quote__lang-btn--active' : ''}`}
              onClick={() => setLocale('es')}
            >
              {t.langEs}
            </button>
            <span className="quote__lang-sep" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={`quote__lang-btn${locale === 'en' ? ' quote__lang-btn--active' : ''}`}
              onClick={() => setLocale('en')}
            >
              {t.langEn}
            </button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="quote__main">
        {submitted ? (
          <p className="quote__confirmation">{t.confirmation}</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <input
              className="quote__honeypot"
              type="text"
              name="website"
              value={form.website}
              onChange={(event) => update('website', event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <section className="quote__section" id="organization">
              <OrganizationFields
                fields={t.fields}
                requiredMark={t.requiredMark}
                organizationName={form.organizationName}
                organizationDescription={form.organizationDescription}
                errors={errors}
                onChange={update}
              />
            </section>

            <section className="quote__section" id="services">
              <fieldset className="quote__fieldset">
                <legend className="quote__legend">
                  <QuestionLabel text={t.fields.services} requiredMark={t.requiredMark} />
                </legend>
                {labels.services.map((option) => (
                  <label key={option.value} className="quote__choice">
                    <input
                      type="checkbox"
                      checked={form.services.includes(option.value)}
                      onChange={() => toggleInArray('services', option.value)}
                    />
                    {option.label}
                  </label>
                ))}
                <FieldError message={errors.services} />
              </fieldset>
            </section>

            {showWeb && (
              <section className="quote__section quote__section--service" aria-labelledby="quote-web">
                <h2 id="quote-web" className="quote__section-title quote__section-title--sticky">
                  {t.sections.web}
                </h2>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="siteType">
                    <QuestionLabel text={t.fields.siteType} requiredMark={t.requiredMark} />
                  </label>
                  <select
                    id="siteType"
                    className="quote__select"
                    value={form.siteType}
                    onChange={(event) => update('siteType', event.target.value)}
                    aria-invalid={Boolean(errors.siteType)}
                  >
                    <option value="">{t.selectOption}</option>
                    {labels.siteTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.siteType} />
                </div>

                {showSiteTypeOther && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="siteTypeOther">
                      <QuestionLabel text={t.fields.siteTypeOther} requiredMark={t.requiredMark} />
                    </label>
                    <input
                      id="siteTypeOther"
                      className="quote__underline"
                      type="text"
                      value={form.siteTypeOther}
                      onChange={(event) => update('siteTypeOther', event.target.value)}
                      aria-invalid={Boolean(errors.siteTypeOther)}
                    />
                    <FieldError message={errors.siteTypeOther} />
                  </div>
                )}

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.siteStatus} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.siteStatus.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="siteStatus"
                        value={option.value}
                        checked={form.siteStatus === option.value}
                        onChange={() => update('siteStatus', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.siteStatus} />
                </fieldset>

                {showCurrentUrl && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="currentSiteUrl">
                      {t.fields.currentSiteUrl}
                    </label>
                    <input
                      id="currentSiteUrl"
                      className="quote__underline"
                      type="url"
                      placeholder="https://"
                      value={form.currentSiteUrl}
                      onChange={(event) => update('currentSiteUrl', event.target.value)}
                      aria-invalid={Boolean(errors.currentSiteUrl)}
                    />
                    <FieldError message={errors.currentSiteUrl} />
                  </div>
                )}

                <div className="quote__field">
                  <label className="quote__label" htmlFor="references">
                    {t.fields.references}
                  </label>
                  <textarea
                    id="references"
                    className="quote__box"
                    style={{ minHeight: 120 }}
                    value={form.references}
                    onChange={(event) => update('references', event.target.value)}
                  />
                </div>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="mainGoal">
                    <QuestionLabel text={t.fields.mainGoal} requiredMark={t.requiredMark} />
                  </label>
                  <textarea
                    id="mainGoal"
                    className="quote__box"
                    value={form.mainGoal}
                    onChange={(event) => update('mainGoal', event.target.value)}
                    aria-invalid={Boolean(errors.mainGoal)}
                  />
                  <FieldError message={errors.mainGoal} />
                </div>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="pageCount">
                    <QuestionLabel text={t.fields.pageCount} requiredMark={t.requiredMark} />
                  </label>
                  <select
                    id="pageCount"
                    className="quote__select"
                    value={form.pageCount}
                    onChange={(event) => update('pageCount', event.target.value)}
                    aria-invalid={Boolean(errors.pageCount)}
                  >
                    <option value="">{t.selectOption}</option>
                    {labels.pageCounts.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.pageCount} />
                </div>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.needsCms} requiredMark={t.requiredMark} helpKey="needsCms" locale={locale} />
                  </legend>
                  {labels.yesNoUnsure.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="needsCms"
                        value={option.value}
                        checked={form.needsCms === option.value}
                        onChange={() => update('needsCms', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.needsCms} />
                </fieldset>

                {showUpdateFrequency && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="updateFrequency">
                      <QuestionLabel text={t.fields.updateFrequency} requiredMark={t.requiredMark} />
                    </label>
                    <select
                      id="updateFrequency"
                      className="quote__select"
                      value={form.updateFrequency}
                      onChange={(event) => update('updateFrequency', event.target.value)}
                      aria-invalid={Boolean(errors.updateFrequency)}
                    >
                      <option value="">{t.selectOption}</option>
                      {labels.updateFrequency.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.updateFrequency} />
                  </div>
                )}

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.multilingual} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.yesNo.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="multilingual"
                        value={option.value}
                        checked={form.multilingual === option.value}
                        onChange={() => update('multilingual', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.multilingual} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">{t.fields.features}</legend>
                  {labels.features.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="checkbox"
                        checked={form.features.includes(option.value)}
                        onChange={() => toggleInArray('features', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </fieldset>

                {showFeaturesOther && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="featuresOther">
                      {t.fields.featuresOther}
                    </label>
                    <input
                      id="featuresOther"
                      className="quote__underline"
                      type="text"
                      value={form.featuresOther}
                      onChange={(event) => update('featuresOther', event.target.value)}
                    />
                  </div>
                )}

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.hasDomainHosting} requiredMark={t.requiredMark} helpKey="hasDomainHosting" locale={locale} />
                  </legend>
                  {labels.yesNoUnsure.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="hasDomainHosting"
                        value={option.value}
                        checked={form.hasDomainHosting === option.value}
                        onChange={() => update('hasDomainHosting', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.hasDomainHosting} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.brandIdentity} requiredMark={t.requiredMark} helpKey="brandIdentity" locale={locale} />
                  </legend>
                  {labels.brandIdentity.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="brandIdentity"
                        value={option.value}
                        checked={form.brandIdentity === option.value}
                        onChange={() => updateBrandIdentity(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.brandIdentity} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.contentReadiness} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.contentReadiness.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="contentReadiness"
                        value={option.value}
                        checked={form.contentReadiness === option.value}
                        onChange={() => update('contentReadiness', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.contentReadiness} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.needsContentProduction} requiredMark={t.requiredMark} helpKey="needsContentProduction" locale={locale} />
                  </legend>
                  {labels.yesNoUnsure.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="needsContentProduction"
                        value={option.value}
                        checked={form.needsContentProduction === option.value}
                        onChange={() => update('needsContentProduction', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.needsContentProduction} />
                </fieldset>
              </section>
            )}

            {showBook && (
              <section className="quote__section quote__section--service" aria-labelledby="quote-book">
                <h2 id="quote-book" className="quote__section-title quote__section-title--sticky">
                  {t.sections.book}
                </h2>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="publicationType">
                    <QuestionLabel text={t.fields.publicationType} requiredMark={t.requiredMark} />
                  </label>
                  <select
                    id="publicationType"
                    className="quote__select"
                    value={form.publicationType}
                    onChange={(event) => update('publicationType', event.target.value)}
                    aria-invalid={Boolean(errors.publicationType)}
                  >
                    <option value="">{t.selectOption}</option>
                    {labels.publicationTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.publicationType} />
                </div>

                {showPublicationTypeOther && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="publicationTypeOther">
                      <QuestionLabel text={t.fields.publicationTypeOther} requiredMark={t.requiredMark} />
                    </label>
                    <input
                      id="publicationTypeOther"
                      className="quote__underline"
                      type="text"
                      value={form.publicationTypeOther}
                      onChange={(event) => update('publicationTypeOther', event.target.value)}
                      aria-invalid={Boolean(errors.publicationTypeOther)}
                    />
                    <FieldError message={errors.publicationTypeOther} />
                  </div>
                )}

                <div className="quote__field">
                  <label className="quote__label" htmlFor="bookPageCount">
                    <QuestionLabel text={t.fields.bookPageCount} requiredMark={t.requiredMark} />
                  </label>
                  <input
                    id="bookPageCount"
                    className="quote__underline"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={form.bookPageCount}
                    onChange={(event) => update('bookPageCount', event.target.value)}
                    aria-invalid={Boolean(errors.bookPageCount)}
                  />
                  <FieldError message={errors.bookPageCount} />
                </div>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.contentBalance} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.contentBalance.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="contentBalance"
                        value={option.value}
                        checked={form.contentBalance === option.value}
                        onChange={() => update('contentBalance', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.contentBalance} />
                </fieldset>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="bookLanguages">
                    <QuestionLabel text={t.fields.bookLanguages} requiredMark={t.requiredMark} />
                  </label>
                  <select
                    id="bookLanguages"
                    className="quote__select"
                    value={form.bookLanguages}
                    onChange={(event) => update('bookLanguages', event.target.value)}
                    aria-invalid={Boolean(errors.bookLanguages)}
                  >
                    <option value="">{t.selectOption}</option>
                    {labels.bookLanguages.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.bookLanguages} />
                </div>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.editorialCare} requiredMark={t.requiredMark} helpKey="editorialCare" locale={locale} />
                  </legend>
                  {labels.editorialCare.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="editorialCare"
                        value={option.value}
                        checked={form.editorialCare === option.value}
                        onChange={() => update('editorialCare', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.editorialCare} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.printScope} requiredMark={t.requiredMark} helpKey="printScope" locale={locale} />
                  </legend>
                  {labels.printScope.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="printScope"
                        value={option.value}
                        checked={form.printScope === option.value}
                        onChange={() => update('printScope', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.printScope} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.hasPrinter} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.yesNo.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="hasPrinter"
                        value={option.value}
                        checked={form.hasPrinter === option.value}
                        onChange={() => update('hasPrinter', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.hasPrinter} />
                </fieldset>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="printRun">
                    {t.fields.printRun}
                  </label>
                  <input
                    id="printRun"
                    className="quote__underline"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={form.printRun}
                    onChange={(event) => update('printRun', event.target.value)}
                  />
                </div>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.needsIsbn} requiredMark={t.requiredMark} helpKey="needsIsbn" locale={locale} />
                  </legend>
                  {labels.yesNoUnsure.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="needsIsbn"
                        value={option.value}
                        checked={form.needsIsbn === option.value}
                        onChange={() => update('needsIsbn', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.needsIsbn} />
                </fieldset>
              </section>
            )}

            {showBrand && (
              <section className="quote__section quote__section--service" aria-labelledby="quote-brand">
                <h2 id="quote-brand" className="quote__section-title quote__section-title--sticky">
                  {t.sections.brand}
                </h2>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.brandStatus} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.brandStatus.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="brandStatus"
                        value={option.value}
                        checked={form.brandStatus === option.value}
                        onChange={() => update('brandStatus', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.brandStatus} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.brandElements} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.brandElements.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="checkbox"
                        checked={form.brandElements.includes(option.value)}
                        onChange={() => toggleInArray('brandElements', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.brandElements} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.namingDefined} requiredMark={t.requiredMark} />
                  </legend>
                  {labels.namingDefined.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="namingDefined"
                        value={option.value}
                        checked={form.namingDefined === option.value}
                        onChange={() => update('namingDefined', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.namingDefined} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">{t.fields.brandApplications}</legend>
                  {BRAND_APPLICATION_GROUPS.map((group) => (
                    <div key={group.key} className="quote__app-group">
                      <p className="quote__app-group-title">
                        {t.applicationGroups[group.key]}
                      </p>
                      {group.values.map((value) => {
                        const option = labels.brandApplications.find((item) => item.value === value)
                        if (!option) return null
                        return (
                          <label key={value} className="quote__choice">
                            <input
                              type="checkbox"
                              checked={form.brandApplications.includes(value)}
                              onChange={() => toggleInArray('brandApplications', value)}
                            />
                            {option.label}
                          </label>
                        )
                      })}
                    </div>
                  ))}
                  <label className="quote__choice">
                    <input
                      type="checkbox"
                      checked={form.brandApplications.includes('Otro')}
                      onChange={() => toggleInArray('brandApplications', 'Otro')}
                    />
                    {labels.brandApplications.find((item) => item.value === 'Otro')?.label ?? 'Otro'}
                  </label>
                </fieldset>

                {showBrandApplicationsOther && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="brandApplicationsOther">
                      {t.fields.brandApplicationsOther}
                    </label>
                    <input
                      id="brandApplicationsOther"
                      className="quote__underline"
                      type="text"
                      value={form.brandApplicationsOther}
                      onChange={(event) => update('brandApplicationsOther', event.target.value)}
                    />
                  </div>
                )}

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    <QuestionLabel text={t.fields.needsBrandManual} requiredMark={t.requiredMark} helpKey="needsBrandManual" locale={locale} />
                  </legend>
                  {labels.yesNoUnsure.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="needsBrandManual"
                        value={option.value}
                        checked={form.needsBrandManual === option.value}
                        onChange={() => update('needsBrandManual', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.needsBrandManual} />
                </fieldset>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="brandAudience">
                    {t.fields.brandAudience}
                  </label>
                  <textarea
                    id="brandAudience"
                    className="quote__box"
                    style={{ minHeight: 120 }}
                    value={form.brandAudience}
                    onChange={(event) => update('brandAudience', event.target.value)}
                  />
                </div>
              </section>
            )}

            {form.services.length > 0 && (
              <>
                <section className="quote__section">
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="launchDate">
                      {t.fields.launchDate}
                    </label>
                    <input
                      id="launchDate"
                      className="quote__underline"
                      type="text"
                      placeholder={t.fields.launchDatePlaceholder}
                      value={form.launchDate}
                      onChange={(event) => update('launchDate', event.target.value)}
                    />
                  </div>

                  <div className="quote__field">
                    <label className="quote__label" htmlFor="budgetRange">
                      {t.fields.budgetRange}
                    </label>
                    <select
                      id="budgetRange"
                      className="quote__select"
                      value={form.budgetRange}
                      onChange={(event) => update('budgetRange', event.target.value)}
                    >
                      <option value="">{t.fields.budgetOptional}</option>
                      {budgetRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="quote__field">
                    <label className="quote__label" htmlFor="contactName">
                      <QuestionLabel text={t.fields.contactName} requiredMark={t.requiredMark} />
                    </label>
                    <input
                      id="contactName"
                      className="quote__underline"
                      type="text"
                      value={form.contactName}
                      onChange={(event) => update('contactName', event.target.value)}
                      aria-invalid={Boolean(errors.contactName)}
                    />
                    <FieldError message={errors.contactName} />
                  </div>

                  <div className="quote__field">
                    <label className="quote__label" htmlFor="contactEmail">
                      <QuestionLabel text={t.fields.contactEmail} requiredMark={t.requiredMark} />
                    </label>
                    <input
                      id="contactEmail"
                      className="quote__underline"
                      type="email"
                      value={form.contactEmail}
                      onChange={(event) => update('contactEmail', event.target.value)}
                      aria-invalid={Boolean(errors.contactEmail)}
                    />
                    <FieldError message={errors.contactEmail} />
                  </div>
                </section>

                <section className="quote__section">
                  <fieldset className="quote__fieldset">
                    <legend className="quote__legend">
                      <QuestionLabel text={t.fields.needsMaintenance} requiredMark={t.requiredMark} helpKey="needsMaintenance" locale={locale} />
                    </legend>
                    {labels.yesNoUnsure.map((option) => (
                      <label key={option.value} className="quote__choice">
                        <input
                          type="radio"
                          name="needsMaintenance"
                          value={option.value}
                          checked={form.needsMaintenance === option.value}
                          onChange={() => update('needsMaintenance', option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                    <FieldError message={errors.needsMaintenance} />
                  </fieldset>
                </section>

                {submitError && <p className="quote__submit-error">{submitError}</p>}

                <button className="quote__submit" type="submit" disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </button>
              </>
            )}
          </form>
        )}
      </main>
    </div>
  )
}
