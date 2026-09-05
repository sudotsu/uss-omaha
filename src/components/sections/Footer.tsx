import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { Footer as FooterType, Metadata } from '@/types/content'

interface FooterProps {
  data: FooterType
  metadata: Metadata
  isPrint?: boolean
}

export function Footer({ data, metadata }: FooterProps) {
  return (
    <footer className="bg-navy-dark text-offwhite border-t-4 border-brass">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-brass font-serif font-bold text-lg mb-2">{metadata.title}</h3>
            <p className="text-xs text-offwhite/60 mb-4">{metadata.subtitle}</p>
            <ul className="space-y-2 text-sm text-offwhite/80">
              {data.address.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-brass font-serif font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-offwhite/80">
              <li className="font-medium text-offwhite">{data.contact.name}</li>
              <li><a href={`mailto:${data.contact.email}`} className="hover:text-brass transition-colors">{data.contact.email}</a></li>
              <li><a href={`tel:${data.contact.phone.replace(/[^0-9]/g, '')}`} className="hover:text-brass transition-colors">{data.contact.phone}</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-brass font-serif font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-offwhite/80">
              {data.quickLinks.map((link) => <li key={`${link.label}-${link.href}`}><a href={link.href} className="hover:text-brass transition-colors">{link.label}</a></li>)}
            </ul>
          </div>

          <div className="md:col-span-1 flex flex-wrap gap-4 items-start content-start">
            {data.logos.map((logo) => {
              const image = <ImageWithFallback src={logo.src} alt={logo.alt} fill className="object-contain" />
              const key = `${logo.src}-${logo.alt}`
              return logo.href ? (
                <a key={key} href={logo.href} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 bg-white/5 rounded p-2 hover:bg-white/10 transition-colors block">{image}</a>
              ) : (
                <div key={key} className="relative w-16 h-16 bg-white/5 rounded p-2">{image}</div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-offwhite/60">
          <p>&copy; {metadata.year} {metadata.title}. All rights reserved.</p>
          <p>Designed & Built in Omaha, NE</p>
        </div>
      </Container>
    </footer>
  )
}
