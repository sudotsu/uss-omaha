'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './Button'

interface NavSection {
  id: string
  label: string
  highlight?: boolean
}

interface StickyNavProps {
  sections: NavSection[]
  pledgeFormUrl: string
}

export function StickyNav({ sections, pledgeFormUrl }: StickyNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Height of sticky nav + padding
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isScrolled ? 'translate-y-0 shadow-lg' : '-translate-y-full'
      }`}
    >
      <div className="bg-navy/95 backdrop-blur-md border-b border-brass/20 text-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-brass font-serif font-bold text-lg">USS Omaha Memorial</span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      section.highlight
                        ? 'bg-brass text-navy hover:bg-brass-light'
                        : 'text-offwhite hover:text-brass hover:bg-white/5'
                    }`}
                  >
                    {section.label}
                  </a>
                ))}

                {/* Always visible pledge button if url provided */}
                {pledgeFormUrl && (
                  <Button
                    href={pledgeFormUrl}
                    variant="outline"
                    download
                    className="ml-4"
                  >
                    Pledge Form
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile menu button placeholder - out of scope for batch 5 but good to note */}
          </div>
        </div>
      </div>
    </nav>
  )
}
