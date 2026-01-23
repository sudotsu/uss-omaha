'use client'

import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import type { WhyNow as WhyNowType } from '@/types/content'
import { useState } from 'react'

interface WhyNowProps {
  data: WhyNowType
}

export function WhyNow({ data }: WhyNowProps) {
  const [showAll, setShowAll] = useState(true)

  const displayedProjects = showAll ? data.projects : data.projects.slice(0, 5)

  return (
    <section id="why-now" className="section-light section-spacing">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border-2 border-brass/20 overflow-hidden">
              <button
                onClick={() => setShowAll(false)}
                className={`px-6 py-2 font-serif transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 ${
                  !showAll
                    ? 'bg-brass text-navy font-bold'
                    : 'bg-white text-slate-deep hover:bg-brass/10'
                }`}
              >
                Top 5
              </button>
              <button
                onClick={() => setShowAll(true)}
                className={`px-6 py-2 font-serif transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 ${
                  showAll
                    ? 'bg-brass text-navy font-bold'
                    : 'bg-white text-slate-deep hover:bg-brass/10'
                }`}
              >
                All Projects
              </button>
            </div>
          </div>

          {/* Projects List */}
          <CardSurface variant="light" padding="md">
            <div className="space-y-4">
              {displayedProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-neutral-light/30 last:border-b-0 hover:bg-brass/5 transition-colors px-4 -mx-4 rounded-md"
                >
                  <span className="text-slate-deep font-medium text-lg flex-1">
                    {project.name}
                  </span>
                  <span className="text-navy font-serif font-bold text-lg ml-4">
                    {project.cost}
                  </span>
                </div>
              ))}
            </div>
          </CardSurface>

          {/* Memorial Highlight */}
          <CardSurface variant="light" padding="lg" className="mt-12 border-4 border-brass/40">
            <div className="text-center">
              <div className="text-brass text-sm font-serif uppercase tracking-widest mb-2">
                {data.tagline}
              </div>
              <h3 className="text-navy text-3xl font-serif font-bold mb-3">
                {data.memorial.name}
              </h3>
              <div className="text-brass-light text-4xl font-serif font-bold">
                {data.memorial.cost}
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
