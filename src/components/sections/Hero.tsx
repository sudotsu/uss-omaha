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
    <section className="relative min-h-[85vh] flex items-start justify-center overflow-hidden pt-16 pb-16">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute top-0 left-0 w-full h-[120%] z-0 animate-ken-burns">
        {/* We use homepage_right.jpg directly as requested */}
        <ImageWithFallback src="/images/homepage_right.jpg" alt="USS Omaha Submarine" fill priority quality={90} className="object-cover object-[center_87%]" />

        {/* Subtle Dark Gradient Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy/80 z-10" />
      </div>

      {/* Content */}
      <div className="text-center animate-fade-up relative z-20 w-full max-w-4xl mx-auto mt-12 md:mt-24">
        {/* Main Heading */}
        <h1 className="text-brass uppercase tracking-wide drop-shadow-lg font-black text-2xl md:text-3xl lg:text-4xl bg-navy-dark/60 p-6 rounded-lg backdrop-blur-sm inline-block mx-auto border border-brass/20 shadow-2xl mb-8 leading-tight">{data.heading}</h1>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="h-px w-16 bg-brass"></div>
          <div className="w-2 h-2 bg-brass rotate-45"></div>
          <div className="h-px w-16 bg-brass"></div>
        </div>

        {/* Subheading */}
        <p className="text-4xl md:text-5xl lg:text-6xl text-offwhite font-serif font-light drop-shadow-md">{data.subheading}</p>

        {/* Countdown Timer */}
        {navy250.deadline && (
          <div className="mt-8 bg-navy-dark/80 rounded-lg p-6 border-2 border-brass/20 max-w-4xl mx-auto backdrop-blur-md shadow-2xl">
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
        <div className="pt-8 animate-bounce">
          <svg className="w-10 h-10 mx-auto text-brass opacity-90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
