'use client'

import { Button } from '@/components/ui/Button'
import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import type { WhatYourGiftBuilds as WhatYourGiftBuildsType } from '@/types/content'
import { useState } from 'react'

interface WhatYourGiftBuildsProps {
  data: WhatYourGiftBuildsType
  isPrint?: boolean
}

export function WhatYourGiftBuilds({ data, isPrint = false }: WhatYourGiftBuildsProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  if (data.items.length === 0) return null

  return (
    <section id="what-your-gift-builds" className={`section-slate ${isPrint ? 'section-spacing-tight' : 'section-spacing'}`}>
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-brass mb-3">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="h-px w-12 bg-brass/50" />
              <div className="w-1.5 h-1.5 bg-brass rotate-45" />
              <div className="h-px w-12 bg-brass/50" />
            </div>
            <p className="text-offwhite text-xl font-serif max-w-3xl mx-auto leading-relaxed">{data.subheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {data.items.map((part) => {
              const isSelected = selectedPart === part.name
              return (
                <CardSurface
                  key={part.name}
                  variant="navy"
                  padding="lg"
                  interactive={!isPrint}
                  onClick={() => !isPrint && setSelectedPart(isSelected ? null : part.name)}
                  className={`h-full flex flex-col transition-all duration-300 ${isSelected ? 'ring-4 ring-brass shadow-2xl scale-105' : ''}`}
                >
                  <div className="flex-1">
                    <div className="inline-block bg-brass text-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      {data.phaseLabel}
                    </div>
                    <h3 className="text-brass-light text-2xl font-serif font-bold mb-4">{part.name}</h3>
                    <div className="h-px bg-brass/30 mb-4" />
                    <p className="text-offwhite/90 leading-relaxed text-sm mb-6">{part.description}</p>
                    {isSelected && (
                      <div className="bg-brass/10 border-l-4 border-brass px-4 py-3 rounded-md">
                        <p className="text-brass font-serif font-bold text-sm">✓ You&apos;ve chosen to build {part.name}</p>
                      </div>
                    )}
                  </div>

                  {!isPrint && (
                    <div className="mt-6">
                      <Button href={`#call-to-action?builds=${encodeURIComponent(part.name)}`} variant={isSelected ? 'primary' : 'secondary'} className="w-full justify-center">
                        {isSelected ? 'Donate to Build This →' : 'Select This Part'}
                      </Button>
                    </div>
                  )}
                </CardSurface>
              )
            })}
          </div>

          <CardSurface variant="navy" padding="lg" className="border-2 border-brass/40">
            <div className="text-center">
              <div className="inline-block bg-brass text-navy px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                {data.promiseHeading}
              </div>
              <p className="text-offwhite text-lg leading-relaxed max-w-2xl mx-auto">{data.promiseText}</p>
            </div>
          </CardSurface>
        </div>
      </Container>
    </section>
  )
}
