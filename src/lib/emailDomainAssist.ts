/** Common personal / Spanish-market email domains for quote form assist. */
export const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'hotmail.es',
  'outlook.com',
  'outlook.es',
  'yahoo.com',
  'yahoo.es',
  'icloud.com',
  'live.com',
  'proton.me',
  'protonmail.com',
  'me.com',
  'volc4n.com',
] as const

/** Exact misspellings → canonical domain (applied on blur). */
export const EMAIL_DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmial.es': 'hotmail.es',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yaho.es': 'yahoo.es',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlok.es': 'outlook.es',
  'icloud.co': 'icloud.com',
  'icoud.com': 'icloud.com',
  'live.co': 'live.com',
  'protonmail.co': 'protonmail.com',
  'proton.mail': 'proton.me',
}

export function splitEmail(value: string): { local: string; domain: string; hasAt: boolean } {
  const at = value.indexOf('@')
  if (at < 0) return { local: value, domain: '', hasAt: false }
  return {
    local: value.slice(0, at),
    domain: value.slice(at + 1),
    hasAt: true,
  }
}

/** Domains that match the typed fragment after `@` (prefix first, then substring). */
export function getDomainSuggestions(domainPartial: string, limit = 6): string[] {
  const q = domainPartial.trim().toLowerCase()
  if (!q) return [...COMMON_EMAIL_DOMAINS].slice(0, limit)

  const prefix: string[] = []
  const rest: string[] = []
  for (const domain of COMMON_EMAIL_DOMAINS) {
    if (domain === q) continue
    if (domain.startsWith(q)) prefix.push(domain)
    else if (domain.includes(q)) rest.push(domain)
  }
  return [...prefix, ...rest].slice(0, limit)
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost)
      prev = cur
    }
  }
  return row[b.length]
}

/**
 * Suggest a corrected full email when the domain looks like a common typo.
 * Returns null if the domain is already known or too far from common ones.
 */
export function suggestEmailCorrection(email: string): string | null {
  const trimmed = email.trim()
  const { local, domain, hasAt } = splitEmail(trimmed)
  if (!hasAt || !local || !domain) return null

  const lower = domain.toLowerCase()
  if ((COMMON_EMAIL_DOMAINS as readonly string[]).includes(lower)) return null

  const fromMap = EMAIL_DOMAIN_TYPOS[lower]
  if (fromMap) return `${local}@${fromMap}`

  let best: string | null = null
  let bestDist = Infinity
  for (const candidate of COMMON_EMAIL_DOMAINS) {
    const dist = levenshtein(lower, candidate)
    const maxDist = lower.length <= 5 ? 1 : 2
    if (dist > 0 && dist <= maxDist && dist < bestDist) {
      best = candidate
      bestDist = dist
    }
  }

  return best ? `${local}@${best}` : null
}
