import type { PortableTextBlock } from '@portabletext/types'

export function plainTextToBlocks(text: string): PortableTextBlock[] {
  const paragraphs = text.split(/\n\n+/).map((part) => part.trim()).filter(Boolean)

  if (paragraphs.length === 0) {
    return []
  }

  return paragraphs.map((paragraph, index) => ({
    _type: 'block',
    _key: `plain-${index}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `plain-${index}-0`,
        text: paragraph,
        marks: [],
      },
    ],
  }))
}

export function hasRichTextContent(blocks: PortableTextBlock[] | undefined): boolean {
  if (!blocks?.length) {
    return false
  }

  return blocks.some(
    (block) =>
      block._type === 'block' &&
      Array.isArray(block.children) &&
      block.children.some(
        (child) =>
          typeof child === 'object' &&
          child !== null &&
          '_type' in child &&
          child._type === 'span' &&
          'text' in child &&
          typeof child.text === 'string' &&
          child.text.trim().length > 0,
      ),
  )
}
