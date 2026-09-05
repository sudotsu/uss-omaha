import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import type { Close as CloseType } from '@/types/content'

interface CloseProps {
  data: CloseType
  isPrint?: boolean
}

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return '#'
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function Close({ data, isPrint = false }: CloseProps) {
  return (
    <section id="close" className={`section-light ${isPrint ? 'section-spacing-tight' : 'section-spacing'}`}>
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass" />
              <div className="w-1.5 h-1.5 bg-brass rotate-45" />
              <div className="h-px w-12 bg-brass" />
            </div>
            <p className="text-brass text-xl font-serif mt-6 uppercase tracking-wide">{data.subheading}</p>
          </div>

          <CardSurface variant="light" padding="lg" className="mb-12 text-center">
            <h3 className="text-navy text-2xl font-serif font-bold mb-6">{data.contactInfo.organization}</h3>
            <div className="space-y-3">
              <p className="text-slate-deep">
                <a
                  href={normalizeExternalUrl(data.contactInfo.website)}
                  className="text-brass hover:text-brass-light text-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 rounded px-2 py-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.contactInfo.website}
                </a>
              </p>
              <p className="text-slate-deep font-medium">Contact: {data.contactInfo.contact}</p>
            </div>
          </CardSurface>
        </div>
      </Container>
    </section>
  )
}
