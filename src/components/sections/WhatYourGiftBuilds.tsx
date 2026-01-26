'use client'

import { Button } from '@/components/ui/Button'
import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import type { Phases as PhasesType } from '@/types/content'
import { useState } from 'react'

interface WhatYourGiftBuildsProps {
  phases: PhasesType
}

function extractPhase4Parts(phases: PhasesType): Array<{ name: string; description: string }> {
  const phase4 = phases.phaseList.find((p) => p.number === 4)
  if (!phase4) return []

  const parts = [
    {
      name: 'Walkways',
      description: 'Concrete pathways allowing visitors to walk around the submarine hull and experience its true scale. These pathways will be ADA-compliant and built to last decades.',
    },
    {
      name: 'Interpretive Exhibits',
      description: "Educational panels telling the story of USS Omaha's 17-year service, the submarine force, and the crew who served. These exhibits will educate future generations about submarine warfare and sacrifice.",
    },
    {
      name: 'Donor Recognition',
      description: "Permanent bronze plaques honoring all who contributed to this memorial. Your name, or a loved one's name, will be displayed alongside fellow patriots who made this project possible.",
    },
  ]

  return parts
}

export function WhatYourGiftBuilds({ phases }: WhatYourGiftBuildsProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const parts = extractPhase4Parts(phases)

  if (parts.length === 0) return null

  return (
    <section id="what-your-gift-builds" className="section-slate section-spacing">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-brass mb-3">What Your Gift Builds</h2>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
            <p className="text-offwhite text-xl font-serif max-w-3xl mx-auto leading-relaxed">
              Choose the part of the memorial your gift will complete. Your contribution goes directly to that specific element — nothing else.
            </p>
          </div>

          {/* Part Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {parts.map((part) => {
              const isSelected = selectedPart === part.name
              return (
                <CardSurface
                  key={part.name}
                  variant="navy"
                  padding="lg"
                  interactive
                  onClick={() => setSelectedPart(isSelected ? null : part.name)}
                  className={`h-full flex flex-col transition-all duration-300 ${
                    isSelected ? 'ring-4 ring-brass shadow-2xl scale-105' : ''
                  }`}
                >
                  <div className="flex-1">
                    {/* Phase Badge */}
                    <div className="inline-block bg-brass text-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      Phase 4
                    </div>

                    {/* Part Name */}
                    <h3 className="text-brass-light text-2xl font-serif font-bold mb-4">
                      {part.name}
                    </h3>

                    {/* Divider */}
                    <div className="h-px bg-brass/30 mb-4"></div>

                    {/* Description */}
                    <p className="text-offwhite/90 leading-relaxed text-sm mb-6">
                      {part.description}
                    </p>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="bg-brass/10 border-l-4 border-brass px-4 py-3 rounded-md">
                        <p className="text-brass font-serif font-bold text-sm">
                          ✓ You&apos;ve chosen to build {part.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <Button
                      href={`#call-to-action?builds=${encodeURIComponent(part.name)}`}
                      variant={isSelected ? 'primary' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {isSelected ? 'Donate to Build This →' : 'Select This Part'}
                    </Button>
                  </div>
                </CardSurface>
              )
            })}
          </div>

          {/* Commitment Statement */}
          <CardSurface variant="navy" padding="lg" className="border-2 border-brass/40">
            <div className="text-center">
              <div className="inline-block bg-brass text-navy px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                Our Promise to You
              </div>
              <p className="text-offwhite text-lg leading-relaxed max-w-2xl mx-auto">
                100% of your designated gift goes directly to building the element you choose. No administrative overhead. No ambiguity. Just your contribution, completing the USS Omaha Memorial.
              </p>
            </div>
          </CardSurface>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
              <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
              <div className="w-2 h-2 bg-brass rotate-45"></div>
              <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
              <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
