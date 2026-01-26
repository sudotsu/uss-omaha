import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { Footer as FooterType } from '@/types/content'

interface FooterProps {
  data: FooterType
}

export function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-dark text-offwhite border-t-4 border-brass">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Address */}
          <div className="md:col-span-1">
            <h3 className="text-brass font-serif font-bold text-lg mb-4">USS Omaha Memorial</h3>
            <div className="space-y-1 text-sm text-offwhite/80">
              {data.address.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-brass font-serif font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-offwhite/80">
              <li className="font-medium text-offwhite">{data.contact.name}</li>
              <li>
                <a href={`mailto:${data.contact.email}`} className="hover:text-brass transition-colors">
                  {data.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${data.contact.phone.replace(/[^0-9]/g, '')}`} className="hover:text-brass transition-colors">
                  {data.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-brass font-serif font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-offwhite/80">
              {data.quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-brass transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners/Logos */}
          <div className="md:col-span-1 flex flex-wrap gap-4 items-start content-start">
             {data.logos.map((logo, i) => (
               <div key={i} className="relative w-16 h-16 bg-white/5 rounded p-2">
                 <ImageWithFallback
                   src={logo.src}
                   alt={logo.alt}
                   fill
                   className="object-contain"
                 />
               </div>
             ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-offwhite/60">
          <p>&copy; {currentYear} USS Omaha SSN-692 Memorial Foundation. All rights reserved.</p>
          <p>Designed & Built in Omaha, NE</p>
        </div>
      </Container>
    </footer>
  )
}
