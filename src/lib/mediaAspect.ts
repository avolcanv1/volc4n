const PORTRAIT_RATIO = 1.05

/** Height / width read from a Sanity asset URL (`…-2094x1397.png`), or null when absent. */
export function aspectFromSrc(src: string): number | null {
  const match = /-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i.exec(src)
  if (!match) {
    return null
  }

  const width = Number(match[1])
  return width > 0 ? Number(match[2]) / width : null
}

export function isPortraitRatio(ratio: number | null | undefined) {
  return ratio != null && ratio > PORTRAIT_RATIO
}
