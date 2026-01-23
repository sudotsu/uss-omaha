import { Container } from '@/components/ui/Container'
import type { Agenda as AgendaType } from '@/types/content'

interface AgendaProps {
  data: AgendaType
  isPrint?: boolean
}

export function Agenda({ data, isPrint = false }: AgendaProps) {
  return (
    <section
      className={`section-slate ${isPrint ? 'section-spacing-tight' : 'section-spacing'} page-break-avoid`}
    >
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          {/* Agenda Items */}
          <ul className="space-y-8">
            {data.items.map((item, index) => (
              <li
                key={index}
                className="group"
              >
                <div className="flex items-start space-x-6">
                  {/* Bullet Point */}
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-3 h-3 bg-brass rotate-45 group-hover:scale-110 transition-transform duration-200"></div>
                  </div>

                  {/* Item Text */}
                  <div className="flex-1">
                    <p className="text-2xl md:text-3xl font-serif text-offwhite leading-relaxed group-hover:text-brass/90 transition-colors duration-200">
                      {item}
                    </p>
                  </div>
                </div>

                {/* Divider (except last item) */}
                {index < data.items.length - 1 && (
                  <div className="mt-8 h-px bg-gradient-to-r from-transparent via-neutral-light/20 to-transparent"></div>
                )}
              </li>
            ))}
          </ul>

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
