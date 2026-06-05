import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import './RichText.css'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#'

      return (
        <a
          className="rich-text__link"
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        >
          {children}
        </a>
      )
    },
  },
}

type RichTextProps = {
  value: PortableTextBlock[]
  className?: string
}

export function RichText({ value, className }: RichTextProps) {
  return (
    <div className={className ? `rich-text ${className}` : 'rich-text'}>
      <PortableText value={value} components={components} />
    </div>
  )
}
