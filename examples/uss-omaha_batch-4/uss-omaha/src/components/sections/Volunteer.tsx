import React from 'react'
import type { Volunteer as VolunteerType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { CardSurface } from '@/components/ui/CardSurface'

interface VolunteerProps {
  data: VolunteerType
}

export function Volunteer({ data }: VolunteerProps) {
  return (
    <section id="volunteer" className="section-light section-spacing">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
            <p className="text-slate-deep text-xl mt-6">{data.subheading}</p>
          </div>

          {/* Contact Information */}
          <CardSurface variant="light" padding="lg" className="mb-8">
            <div className="text-center mb-8">
              <h3 className="text-navy text-2xl font-serif font-bold mb-2">{data.contact.name}</h3>
              <div className="h-px bg-brass/30 w-32 mx-auto mb-6"></div>
              <div className="space-y-3">
                <p className="text-slate-deep">
                  <a
                    href={`tel:${data.contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-brass hover:text-brass-light font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 rounded px-2 py-1"
                  >
                    {data.contact.phone}
                  </a>
                </p>
                <p className="text-slate-deep">
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="text-brass hover:text-brass-light underline transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 rounded px-2 py-1"
                  >
                    {data.contact.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Opportunities */}
            <div className="border-t border-neutral-light/30 pt-6">
              <h4 className="text-navy font-serif font-bold mb-4 text-center">Volunteer Opportunities</h4>
              <ul className="space-y-3">
                {data.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-2 h-2 bg-brass rotate-45"></div>
                    </div>
                    <span className="text-slate-deep flex-1">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organization */}
            <div className="mt-8 bg-brass/5 rounded-md px-4 py-3 border-l-4 border-brass">
              <p className="text-slate-deep text-sm font-medium text-center">{data.organization}</p>
              <p className="text-slate-deep text-sm text-center mt-1">{data.organizationContact}</p>
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
