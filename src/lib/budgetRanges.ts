import { SERVICE_VALUES, type QuoteLocale } from './quoteCopy'

type BudgetFloorId = 'brand' | 'bookLow' | 'web' | 'bookMid' | 'bookHigh'

type BudgetFloor = {
  id: BudgetFloorId
  /** Lower bound used to pick the highest floor when multi-selecting. */
  min: number
  /** Ordered options; first entry is the floor. */
  values: string[]
}

const BUDGET_FLOORS: Record<BudgetFloorId, BudgetFloor> = {
  brand: {
    id: 'brand',
    min: 20_000,
    values: [
      '$20,000 – $25,000 MXN',
      '$25,000 – $50,000 MXN',
      '$50,000 – $80,000 MXN',
      'Más de $80,000 MXN',
    ],
  },
  bookLow: {
    id: 'bookLow',
    min: 30_000,
    values: [
      '$30,000 – $35,000 MXN',
      '$35,000 – $50,000 MXN',
      '$50,000 – $80,000 MXN',
      'Más de $80,000 MXN',
    ],
  },
  web: {
    id: 'web',
    min: 35_000,
    values: [
      '$35,000 – $40,000 MXN',
      '$40,000 – $60,000 MXN',
      '$60,000 – $100,000 MXN',
      'Más de $100,000 MXN',
    ],
  },
  bookMid: {
    id: 'bookMid',
    min: 45_000,
    values: [
      '$45,000 – $60,000 MXN',
      '$60,000 – $100,000 MXN',
      '$100,000 – $150,000 MXN',
      'Más de $150,000 MXN',
    ],
  },
  bookHigh: {
    id: 'bookHigh',
    min: 70_000,
    values: [
      '$70,000+ MXN',
      '$100,000 – $150,000 MXN',
      'Más de $150,000 MXN',
    ],
  },
}

const BUDGET_RANGE_LABELS_EN: Record<string, string> = {
  '$20,000 – $25,000 MXN': '$20,000 – $25,000 MXN',
  '$25,000 – $50,000 MXN': '$25,000 – $50,000 MXN',
  '$30,000 – $35,000 MXN': '$30,000 – $35,000 MXN',
  '$35,000 – $40,000 MXN': '$35,000 – $40,000 MXN',
  '$35,000 – $50,000 MXN': '$35,000 – $50,000 MXN',
  '$40,000 – $60,000 MXN': '$40,000 – $60,000 MXN',
  '$45,000 – $60,000 MXN': '$45,000 – $60,000 MXN',
  '$50,000 – $80,000 MXN': '$50,000 – $80,000 MXN',
  '$60,000 – $100,000 MXN': '$60,000 – $100,000 MXN',
  '$70,000+ MXN': '$70,000+ MXN',
  '$100,000 – $150,000 MXN': '$100,000 – $150,000 MXN',
  'Más de $80,000 MXN': 'Over $80,000 MXN',
  'Más de $100,000 MXN': 'Over $100,000 MXN',
  'Más de $150,000 MXN': 'Over $150,000 MXN',
}

/** Parse free-text / numeric page count; returns null when empty or unparseable. */
export function parseBookPageCount(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const matches = [...trimmed.matchAll(/\d[\d,]*/g)].map((match) =>
    Number(match[0].replace(/,/g, '')),
  )
  const numbers = matches.filter((n) => Number.isFinite(n) && n > 0)
  if (!numbers.length) return null
  // Prefer the highest number when a range like "100-200" is typed.
  return Math.max(...numbers)
}

function bookFloorId(pages: number | null): BudgetFloorId {
  if (pages == null) return 'bookMid'
  if (pages <= 100) return 'bookLow'
  if (pages <= 200) return 'bookMid'
  return 'bookHigh'
}

export function resolveBudgetFloor(
  services: string[],
  bookPageCount: string,
): BudgetFloor | null {
  const candidates: BudgetFloor[] = []

  if (services.includes(SERVICE_VALUES.brand)) {
    candidates.push(BUDGET_FLOORS.brand)
  }
  if (services.includes(SERVICE_VALUES.web)) {
    candidates.push(BUDGET_FLOORS.web)
  }
  if (services.includes(SERVICE_VALUES.book)) {
    candidates.push(BUDGET_FLOORS[bookFloorId(parseBookPageCount(bookPageCount))])
  }

  if (!candidates.length) return null

  return candidates.reduce((highest, current) =>
    current.min > highest.min ? current : highest,
  )
}

export function getBudgetRangeOptions(
  services: string[],
  bookPageCount: string,
  locale: QuoteLocale,
): { value: string; label: string }[] {
  const floor = resolveBudgetFloor(services, bookPageCount)
  if (!floor) return []

  return floor.values.map((value) => ({
    value,
    label: locale === 'en' ? (BUDGET_RANGE_LABELS_EN[value] ?? value) : value,
  }))
}
