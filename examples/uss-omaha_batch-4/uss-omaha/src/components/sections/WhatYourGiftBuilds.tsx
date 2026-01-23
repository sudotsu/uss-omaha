import React from 'react'
import type { Phases as PhasesType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { CardSurface } from '@/components/ui/CardSurface'
import { Button } from '@/components/ui/Button'

interface WhatYourGiftBuildsProps {
  phases: PhasesType
}

function extractPhase4Parts(phases: PhasesType): string[] {
  const phase4 = phases.phaseList.find((p) => p.number === 4)
  if (!phase4) return []

  // Typical title: "Complete Walkways, Interpretive Exhibits, Donor Plaques"
  const raw = phase4.title.replace(/^Complete\s+/i, '')
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function WhatYourGiftBuilds({ phases }: WhatYourGiftBuildsProps) {
  const parts = extractPhase4Parts(phases)
  if (parts.length === 0) return null

  return (
    <section id="what-your-gift-builds" className="section-light section-spacing-tight">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-navy mb-3">What Your Gift Builds</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
            <p className="text-slate-deep text-lg mt-6 max-w-3xl mx-auto">
              Choose a tangible part of the memorial you want to help complete.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {parts.map((name) => (
              <CardSurface key={name} variant="light" padding="lg" interactive className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="text-brass text-sm font-serif uppercase tracking-widest mb-2">Phase 4</div>
                  <h3 className="text-navy text-2xl font-serif font-bold mb-3">{name}</h3>
                  <div className="h-px bg-brass/30 mb-4"></div>
                  <p className="text-slate-deep">
                    Supports completion of <span className="font-medium">{name}</span> as part of the memorial build.
                  </p>
                </div>

                <div className="mt-6">
                  <Button href="#call-to-action" variant="primary" className="w-full justify-center">
                    Support this part
                  </Button>
                </div>
              </CardSurface>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
