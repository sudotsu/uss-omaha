import React from 'react'
import type { Stakeholders as StakeholdersType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { CardSurface } from '@/components/ui/CardSurface'

interface StakeholdersProps {
  data: StakeholdersType
}

export function Stakeholders({ data }: StakeholdersProps) {
  return (
    <section id="stakeholders" className="section-navy section-spacing">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.members.map((member, index) => (
              <CardSurface key={index} variant="navy" padding="md" interactive>
                <div className="text-center">
                  <h3 className="text-brass-light text-xl font-serif font-bold mb-2">
                    {member.name}
                  </h3>
                  <div className="h-px bg-brass/30 w-24 mx-auto mb-3"></div>
                  <p className="text-offwhite font-medium mb-1">{member.title}</p>
                  {member.subtitle && (
                    <p className="text-offwhite/70 text-sm">{member.subtitle}</p>
                  )}
                </div>
              </CardSurface>
            ))}
          </div>

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
