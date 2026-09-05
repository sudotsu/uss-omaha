'use client'

import { Button } from '@/components/ui/Button'
import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import type { CallToActionSection, Metadata } from '@/types/content'
import { useEffect, useState } from 'react'

interface CallToActionProps {
  data: CallToActionSection
  mode: Metadata['mode']
  isPrint?: boolean
}

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return '#'
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function CallToAction({ data, mode, isPrint = false }: CallToActionProps) {
  const [selectedBuilds, setSelectedBuilds] = useState<string | null>(null)
  const content = mode === 'donor' ? data.donor : data.memorial

  useEffect(() => {
    if (isPrint) return
    const timer = window.setTimeout(() => {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.split('?')[1] || '')
      const buildsParam = params.get('builds')
      if (!buildsParam) return
      setSelectedBuilds(decodeURIComponent(buildsParam))
      document.getElementById('call-to-action')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [isPrint])

  return (
    <section id="call-to-action" className={`section-slate ${isPrint ? 'section-spacing-tight' : 'section-spacing'}`}>
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{content.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50" />
              <div className="w-1.5 h-1.5 bg-brass rotate-45" />
              <div className="h-px w-12 bg-brass/50" />
            </div>
            <p className="text-brass-light text-xl font-serif mt-6 italic">{content.tagline}</p>
          </div>

          {selectedBuilds && (
            <CardSurface variant="navy" padding="md" className="mb-8 border-2 border-brass">
              <div className="text-center">
                <div className="text-brass text-sm font-serif uppercase tracking-wider mb-2">Your Choice</div>
                <p className="text-offwhite text-lg">
                  You&apos;ve chosen to build: <strong className="text-brass-light font-serif text-xl">{selectedBuilds}</strong>
                </p>
                <p className="text-offwhite/70 text-sm mt-2">Your gift will go directly to completing this element.</p>
              </div>
            </CardSurface>
          )}

          <CardSurface variant="slate" padding="lg" className="mb-8">
            <h3 className="text-brass text-2xl font-serif font-bold mb-8 text-center">{content.donationHeading}</h3>

            <div className="bg-navy-dark/50 rounded-lg p-6 mb-6 border-2 border-brass/20">
              <h4 className="text-brass-light text-lg font-serif font-bold mb-4">{content.primaryOrg.name}</h4>
              <div className="space-y-2 text-offwhite">
                <p className="text-sm"><span className="font-bold">EIN:</span> {content.primaryOrg.ein}</p>
                <p className="text-sm">
                  <span className="font-bold">Website:</span>{' '}
                  <a href={normalizeExternalUrl(content.primaryOrg.website)} className="text-brass hover:text-brass-light underline transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 rounded" target="_blank" rel="noopener noreferrer">
                    {content.primaryOrg.website}
                  </a>
                </p>
                <p className="text-sm">
                  <span className="font-bold">Email:</span>{' '}
                  <a href={`mailto:${content.primaryOrg.email}`} className="text-brass hover:text-brass-light underline transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 rounded">
                    {content.primaryOrg.email}
                  </a>
                </p>
                <p className="text-sm"><span className="font-bold">Phone:</span> {content.primaryOrg.phone}</p>
                <div className="pt-2 border-t border-brass/20 mt-4">
                  <p className="text-sm font-bold mb-1">Mail Donations To:</p>
                  <p className="text-sm">{content.primaryOrg.mailingAddress.attention}</p>
                  <p className="text-sm">{content.primaryOrg.mailingAddress.address}</p>
                  <p className="text-sm">{content.primaryOrg.mailingAddress.city}</p>
                  {selectedBuilds && <p className="text-brass text-sm mt-2 italic">✓ Please note in memo: &quot;{selectedBuilds}&quot;</p>}
                </div>
              </div>
            </div>

            <div className="bg-navy-dark/50 rounded-lg p-6 border-2 border-brass/20">
              <h4 className="text-brass-light text-lg font-serif font-bold mb-4">{content.alternateOrg.name}</h4>
              <div className="space-y-2 text-offwhite">
                <p className="text-sm"><span className="font-bold">EIN:</span> {content.alternateOrg.ein}</p>
                <p className="text-sm italic text-offwhite/80 mt-3">{content.alternateOrg.note}</p>
              </div>
            </div>

            {content.trustIndicators.length > 0 && (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2" aria-label="Donation trust indicators">
                {content.trustIndicators.map((indicator) => (
                  <li key={indicator} className="rounded-md border border-brass/20 bg-navy-dark/30 px-3 py-2 text-center text-sm text-offwhite/85">✓ {indicator}</li>
                ))}
              </ul>
            )}

            <div className="mt-6 bg-brass/10 rounded-md px-4 py-3 border-l-4 border-brass">
              <p className="text-brass font-serif font-bold text-center">{content.taxNote}</p>
            </div>
          </CardSurface>

          <div className="text-center">
            <Button href={content.pledgeFormUrl} variant="primary" download className="text-lg">{content.pledgeFormText}</Button>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2">
              {[0.5, 0.75, 1, 0.75, 0.5].map((opacity, index) => (
                <div key={`${opacity}-${index}`} className="w-2 h-2 bg-brass rotate-45" style={{ opacity }} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
