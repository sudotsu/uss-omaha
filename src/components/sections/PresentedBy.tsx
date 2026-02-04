import { Container } from '@/components/ui/Container'
import type { PresentedBy as PresentedByType } from '@/types/content'

interface PresentedByProps {
  data: PresentedByType
  isPrint?: boolean
}

export function PresentedBy({ data, isPrint = false }: PresentedByProps) {
  return (
    <section id="presented-by" className={`section-slate ${isPrint ? 'py-4' : 'py-12'}`}>
      <Container>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-brass text-center text-xl font-serif mb-8">{data.heading}</h3>
          <div className="flex justify-center">
            {data.presenters.map((presenter, index) => (
              <div key={index} className="text-center">
                <p className="text-brass-light font-serif font-bold text-lg mb-1">{presenter.name}</p>
                <p className="text-offwhite/80 text-sm mb-1">{presenter.org}</p>
                <p className="text-offwhite/60 text-sm italic">{presenter.title}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
