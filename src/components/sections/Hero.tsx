import { Container } from '@/components/ui/Container'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { Hero as HeroType, Navy250 } from '@/types/content'
import Image from 'next/image'

interface HeroProps {
  data: HeroType
  navy250: Navy250
  isPrint?: boolean
}

export function Hero({ data, navy250, isPrint = false }: HeroProps) {
  if (isPrint) {
    return (
      <section className="section-navy py-16 page-break-avoid">
        <Container>
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <Image src="/images/logos/navy-250.svg" alt="Navy 250th Anniversary" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-brass uppercase tracking-wide">{data.heading}</h1>
            <div className="h-1 w-24 bg-brass mx-auto"></div>
            <p className="text-3xl text-offwhite font-serif">{data.subheading}</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback src={data.backgroundImage} alt="USS Omaha Submarine" fill priority quality={90} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/85 to-navy/90"></div>
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Navy 250 Logo */}
          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40 lg:w-48 lg:h-48">
              <Image src="/images/logos/navy-250.svg" alt="Navy 250th Anniversary" fill className="object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-brass uppercase tracking-wide drop-shadow-lg">{data.heading}</h1>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-16 bg-brass"></div>
            <div className="w-2 h-2 bg-brass rotate-45"></div>
            <div className="h-px w-16 bg-brass"></div>
          </div>

          {/* Subheading */}
          <p className="text-4xl md:text-5xl lg:text-6xl text-offwhite font-serif font-light">{data.subheading}</p>

          {/* Countdown Timer */}
          {navy250.deadline && (
            <div className="mt-16 bg-navy-dark/50 rounded-lg p-8 border-2 border-brass/20 max-w-4xl mx-auto">
              <div className="text-brass text-sm font-serif uppercase tracking-widest mb-4">
                {navy250.deadlineLabel || 'Navy 250th Anniversary Goal'}
              </div>
              <CountdownTimer targetDate={navy250.deadline} />
              <p className="text-offwhite/80 text-sm mt-4 italic">
                {navy250.deadlineText || 'Complete the memorial by this historic milestone'}
              </p>
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="pt-16 animate-bounce">
            <svg className="w-8 h-8 mx-auto text-brass opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  )
}
