import type { PortableTextBlock } from '@portabletext/types'

export const ABOUT_NAME_HIGHLIGHT = 'Andrea Volcán Variya'
export const ABOUT_NAME_MARK = 'nameHighlight'

export function injectNameHighlight(
  blocks: PortableTextBlock[],
  name = ABOUT_NAME_HIGHLIGHT,
): PortableTextBlock[] {
  return blocks.map((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) {
      return block
    }

    const children: NonNullable<PortableTextBlock['children']> = []

    for (const child of block.children) {
      if (
        typeof child !== 'object' ||
        child === null ||
        !('_type' in child) ||
        child._type !== 'span' ||
        !('text' in child) ||
        typeof child.text !== 'string'
      ) {
        children.push(child)
        continue
      }

      const text = child.text
      const index = text.indexOf(name)

      if (index === -1) {
        children.push(child)
        continue
      }

      const before = text.slice(0, index)
      const after = text.slice(index + name.length)
      const marks = Array.isArray(child.marks) ? child.marks : []

      if (before) {
        children.push({
          ...child,
          _key: `${child._key}-before`,
          text: before,
        })
      }

      children.push({
        ...child,
        _key: `${child._key}-name`,
        text: name,
        marks: [...marks, ABOUT_NAME_MARK],
      })

      if (after) {
        children.push({
          ...child,
          _key: `${child._key}-after`,
          text: after,
        })
      }
    }

    return {
      ...block,
      children,
    }
  })
}
