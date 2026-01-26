import { Container } from '@/components/ui/Container'
import { DocumentCard } from '@/components/ui/DocumentCard'
import type { Letters as LettersType } from '@/types/content'

interface LettersProps {
  data: LettersType
  isPrint?: boolean
}

export function Letters({ data, isPrint = false }: LettersProps) {
  return (
    <section
      className={`section-slate ${isPrint ? 'section-spacing-tight' : 'section-spacing'}`}
    >
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 page-break-avoid ${isPrint ? 'break-after-avoid' : ''}`}>
            <h2 className="text-brass mb-4">{data.heading}</h2>
            {data.description && (
              <p className="text-lg text-offwhite/80 max-w-2xl mx-auto mb-6">{data.description}</p>
            )}
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          {/* Documents Grid */}
          <div
            className={
              isPrint
                ? 'space-y-8'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            }
          >
            {data.items.map((doc, index) => (
              <DocumentCard
                key={index}
                title={doc.title}
                image={doc.image}
                excerpt={doc.excerpt}
                isPrint={isPrint}
              />
            ))}
          </div>

          {/* Bottom Accent */}
          {!isPrint && (
            <div className="mt-16 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
                <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
                <div className="w-2 h-2 bg-brass rotate-45"></div>
                <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
                <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
