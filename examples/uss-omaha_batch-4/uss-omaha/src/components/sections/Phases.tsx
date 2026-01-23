import React from 'react'
import type { Phases as PhasesType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { CardSurface } from '@/components/ui/CardSurface'

interface PhasesProps {
  data: PhasesType
}

export function Phases({ data }: PhasesProps) {
  return (
    <section id="phases" className="section-light section-spacing">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          {/* Phases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.phaseList.map((phase) => (
              <CardSurface
                key={phase.number}
                variant="light"
                padding="md"
                interactive
                className="overflow-hidden"
              >
                {/* Phase Header */}
                <div className="bg-navy text-brass px-6 py-4 flex items-center justify-between -m-6 mb-6">
                  <div>
                    <div className="text-sm font-serif uppercase tracking-wider opacity-80">
                      Phase {phase.number}
                    </div>
                    <h3 className="text-xl font-serif font-bold mt-1">{phase.title}</h3>
                  </div>
                  <div className="text-3xl font-serif font-bold opacity-50">{phase.number}</div>
                </div>

                {/* Phase Content */}
                <div className="space-y-4">
                  {/* Description */}
                  <p className="text-slate-deep leading-relaxed">{phase.description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-deep font-medium">Progress</span>
                      <span className="text-navy font-bold">{phase.percentComplete}%</span>
                    </div>
                    <div className="w-full bg-neutral-light/30 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brass to-brass-light h-full rounded-full transition-all duration-500"
                        style={{ width: `${phase.percentComplete}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="pt-2 border-t border-neutral-light/30">
                    <div className="text-sm text-slate-deep">
                      <span className="font-serif font-bold">Status:</span>{' '}
                      {phase.status}
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="bg-brass/5 rounded-md px-4 py-3 border-l-4 border-brass">
                    <div className="text-sm text-slate-deep font-medium">
                      Cost:{' '}
                      <span className="text-navy font-bold text-base">{phase.cost}</span>
                    </div>
                  </div>
                </div>
              </CardSurface>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
