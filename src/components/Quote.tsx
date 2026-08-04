import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import {
  OPTION_VALUES,
  UNSURE_HELPERS,
  quoteCopy,
  type QuoteLocale,
  type UnsureHelperField,
} from '../lib/quoteCopy'
import { validateQuote, type QuoteFieldErrors, type QuotePayload } from '../lib/quoteValidation'
import { ThemeToggle } from './ThemeToggle'
import './Quote.css'

const INITIAL: QuotePayload = {
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="quote__error">{message}</p>
}

function UnsureHelper({ field, value }: { field: UnsureHelperField; value: string }) {
  if (value !== 'No estoy seguro') return null
  return <p className="quote__helper">{UNSURE_HELPERS[field]}</p>
}

export function Quote() {
  const { isDark } = useTheme()
  const [locale, setLocale] = useState<QuoteLocale>('es')
  const [form, setForm] = useState<QuotePayload>(INITIAL)
  const [errors, setErrors] = useState<QuoteFieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const t = quoteCopy[locale]

  const labels = useMemo(
    () => ({
      siteTypes: OPTION_VALUES.siteTypes.map((value, index) => ({
        value,
        label: t.options.siteTypes[index],
      })),
      siteStatus: OPTION_VALUES.siteStatus.map((value, index) => ({
        value,
        label: t.options.siteStatus[index],
      })),
      pageCounts: OPTION_VALUES.pageCounts.map((value, index) => ({
        value,
        label: t.options.pageCounts[index],
      })),
      yesNoUnsure: OPTION_VALUES.yesNoUnsure.map((value, index) => ({
        value,
        label: t.options.yesNoUnsure[index],
      })),
      yesNo: OPTION_VALUES.yesNo.map((value, index) => ({
        value,
        label: t.options.yesNo[index],
      })),
      updateFrequency: OPTION_VALUES.updateFrequency.map((value, index) => ({
        value,
        label: t.options.updateFrequency[index],
      })),
      features: OPTION_VALUES.features.map((value, index) => ({
        value,
        label: t.options.features[index],
      })),
      brandIdentity: OPTION_VALUES.brandIdentity.map((value, index) => ({
        value,
        label: t.options.brandIdentity[index],
      })),
      contentReadiness: OPTION_VALUES.contentReadiness.map((value, index) => ({
        value,
        label: t.options.contentReadiness[index],
      })),
      budgetRanges: OPTION_VALUES.budgetRanges.map((value, index) => ({
        value,
        label: t.options.budgetRanges[index],
      })),
    }),
    [t],
  )

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function toggleFeature(feature: string) {
    setForm((current) => {
      const has = current.features.includes(feature)
      return {
        ...current,
        features: has
          ? current.features.filter((item) => item !== feature)
          : [...current.features, feature],
      }
    })
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
        setSubmitError(t.submitError)
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError(t.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const showUpdateFrequency = form.needsCms === 'Sí' || form.needsCms === 'No estoy seguro'
  const showSiteTypeOther = form.siteType === 'Otro'
  const showCurrentUrl = form.siteStatus === 'Rediseño'
  const showFeaturesOther = form.features.includes('Otro')

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
          <>
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

              <section className="quote__section">
                <div className="quote__field">
                  <label className="quote__label" htmlFor="organizationName">
                    {t.fields.organizationName} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
                  </label>
                  <input
                    id="organizationName"
                    className="quote__underline"
                    type="text"
                    value={form.organizationName}
                    onChange={(event) => update('organizationName', event.target.value)}
                    aria-invalid={Boolean(errors.organizationName)}
                  />
                  <FieldError message={errors.organizationName} />
                </div>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="organizationDescription">
                    {t.fields.organizationDescription} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
                  </label>
                  <textarea
                    id="organizationDescription"
                    className="quote__box"
                    value={form.organizationDescription}
                    onChange={(event) => update('organizationDescription', event.target.value)}
                    aria-invalid={Boolean(errors.organizationDescription)}
                  />
                  <FieldError message={errors.organizationDescription} />
                </div>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="siteType">
                    {t.fields.siteType} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                      {t.fields.siteTypeOther} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                    {t.fields.siteStatus} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                    {t.fields.mainGoal} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
              </section>

              <section className="quote__section">
                <div className="quote__field">
                  <label className="quote__label" htmlFor="pageCount">
                    {t.fields.pageCount} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                    {t.fields.needsCms} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                  <UnsureHelper field="needsCms" value={form.needsCms} />
                  <FieldError message={errors.needsCms} />
                </fieldset>

                {showUpdateFrequency && (
                  <div className="quote__field">
                    <label className="quote__label" htmlFor="updateFrequency">
                      {t.fields.updateFrequency} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                    {t.fields.multilingual} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                        onChange={() => toggleFeature(option.value)}
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
                    {t.fields.hasDomainHosting} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                  <UnsureHelper field="hasDomainHosting" value={form.hasDomainHosting} />
                  <FieldError message={errors.hasDomainHosting} />
                </fieldset>
              </section>

              <section className="quote__section">
                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    {t.fields.brandIdentity} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
                  </legend>
                  {labels.brandIdentity.map((option) => (
                    <label key={option.value} className="quote__choice">
                      <input
                        type="radio"
                        name="brandIdentity"
                        value={option.value}
                        checked={form.brandIdentity === option.value}
                        onChange={() => update('brandIdentity', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  <FieldError message={errors.brandIdentity} />
                </fieldset>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    {t.fields.contentReadiness} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                    {t.fields.needsContentProduction} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                  <UnsureHelper field="needsContentProduction" value={form.needsContentProduction} />
                  <FieldError message={errors.needsContentProduction} />
                </fieldset>
              </section>

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
                    {labels.budgetRanges.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="quote__field">
                  <label className="quote__label" htmlFor="contactName">
                    {t.fields.contactName} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                    {t.fields.contactEmail} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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

              <section className="quote__section" aria-labelledby="quote-support">
                <h2 id="quote-support" className="quote__section-title">
                  {t.sections.support}
                </h2>

                <fieldset className="quote__fieldset">
                  <legend className="quote__legend">
                    {t.fields.needsMaintenance} <span className="quote__required" aria-hidden="true">{t.requiredMark}</span>
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
                  <UnsureHelper field="needsMaintenance" value={form.needsMaintenance} />
                  <FieldError message={errors.needsMaintenance} />
                </fieldset>
              </section>

              {submitError && <p className="quote__submit-error">{submitError}</p>}

              <button className="quote__submit" type="submit" disabled={submitting}>
                {submitting ? t.submitting : t.submit}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
