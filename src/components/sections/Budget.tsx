import { Container } from '@/components/ui/Container'
import type { Budget as BudgetType } from '@/types/content'

interface BudgetProps {
  data: BudgetType
}

export function Budget({ data }: BudgetProps) {
  return (
    <section id="budget" className="section-slate section-spacing">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-brass/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-navy-dark px-8 py-6 border-b-4 border-brass">
              <div className="text-center">
                <div className="text-brass text-sm font-serif uppercase tracking-widest mb-2">
                  Total Cost Remaining
                </div>
                <div className="text-brass-light text-5xl md:text-6xl font-serif font-bold">
                  {data.totalRemaining}
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="px-8 py-6 bg-brass/5">
              <p className="text-slate-deep text-center leading-relaxed italic">
                {data.note}
              </p>
            </div>

            {/* Visual Accent */}
            <div className="h-2 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-8">
            <div className="w-16 h-16 border-2 border-brass/30 rotate-45"></div>
            <div className="w-16 h-16 border-2 border-brass/30 rotate-45 scale-75"></div>
            <div className="w-16 h-16 border-2 border-brass/30 rotate-45"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
