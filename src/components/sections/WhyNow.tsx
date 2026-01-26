'use client'

import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import type { WhyNow as WhyNowType } from '@/types/content'

interface WhyNowProps {
  data: WhyNowType
}

export function WhyNow({ data }: WhyNowProps) {
  return (
    <section id="why-now" className="section-light section-spacing">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
            <p className="text-slate-deep text-lg font-serif italic mt-6">{data.tagline}</p>
          </div>

          <CardSurface variant="light" padding="lg">
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="flex justify-between items-center border-b border-slate/20 pb-4 last:border-0">
                  <span className="text-slate-deep font-medium">{project.name}</span>
                  <span className="text-navy font-bold font-serif">{project.cost}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-brass">
              <div className="flex justify-between items-center">
                <span className="text-navy font-bold text-xl uppercase tracking-wider">{data.memorial.name}</span>
                <span className="text-brass font-bold font-serif text-2xl">{data.memorial.cost}</span>
              </div>
            </div>
          </CardSurface>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
