import { Container } from '@/components/ui/Container'
import type { FundraisingProgress as ProgressType } from '@/types/content'

interface FundraisingProgressProps {
  data: ProgressType
}

export function FundraisingProgress({ data }: FundraisingProgressProps) {
  const progressPercent = Math.round((data.raised / data.goal) * 100)

  return (
    <section className="bg-brass/10 py-12 border-y-2 border-brass/20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {/* Amount Raised */}
          <div className="mb-6">
            <div className="text-navy text-5xl md:text-6xl font-serif font-bold mb-2">
              ${data.raised.toLocaleString()}
            </div>
            <div className="text-navy/70 text-lg">raised toward Phase 4</div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-8 bg-navy/20 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-navy to-navy-dark transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Goal & Remaining */}
          <div className="grid grid-cols-2 gap-6 text-navy">
            <div>
              <div className="text-3xl font-serif font-bold">${data.goal.toLocaleString()}</div>
              <div className="text-sm uppercase tracking-wider opacity-70">Goal</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold">
                ${(data.goal - data.raised).toLocaleString()}
              </div>
              <div className="text-sm uppercase tracking-wider opacity-70">Remaining</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-6 pt-6 border-t border-navy/10">
            <p className="text-navy/70 text-sm">
              <strong className="text-navy">{data.donorCount}</strong> patriots have contributed •{' '}
              <span className="italic">Last gift: {data.lastGiftTime}</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
