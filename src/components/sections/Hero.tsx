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
  const showNavyHeading = navy250.heading.trim() && navy250.heading.trim() !== data.heading.trim()
  const navyLine = [navy250.subheading, navy250.subtitle].filter(Boolean).join(' • ')

  if (isPrint) {
    return (
      <section className="section-navy py-16 page-break-avoid">
        <Container>
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <ImageWithFallback src={navy250.logo} alt="Navy anniversary mark" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-brass uppercase tracking-wide">{data.heading}</h1>
            <div className="h-1 w-24 bg-brass mx-auto" />
            <p className="text-3xl text-offwhite font-serif">{data.subheading}</p>
            {showNavyHeading && <p className="text-brass-light font-serif text-xl">{navy250.heading}</p>}
            {navyLine && <p className="text-offwhite/75 text-sm uppercase tracking-widest">{navyLine}</p>}
            {navy250.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                {navy250.images.slice(0, 2).map((src) => (
                  <div key={src} className="relative aspect-[16/9] overflow-hidden rounded-lg border border-brass/20">
                    <ImageWithFallback src={src} alt="USS Omaha historical image" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative min-h-[85vh] flex items-start justify-center overflow-hidden pt-16 pb-16">
      <div className="absolute top-0 left-0 w-full h-[120%] z-0 animate-ken-burns">
        <ImageWithFallback src={data.backgroundImage} alt="USS Omaha Submarine" fill priority quality={90} className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy/80 z-10" />
      </div>

      <div className="text-center animate-fade-in relative z-20 w-full max-w-4xl mx-auto mt-12 md:mt-24 px-4">
        {navy250.logo && (
          <div className="relative w-20 h-20 mx-auto mb-4 drop-shadow-xl">
            <Image src={navy250.logo} alt="Navy anniversary mark" fill className="object-contain" />
          </div>
        )}

        <div className="bg-slate-deep py-6 px-4 md:py-8 w-full shadow-2xl mb-8">
          <h1 className="text-brass uppercase tracking-wide">{data.heading}</h1>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="h-px w-16 bg-brass" />
          <div className="w-2 h-2 bg-brass rotate-45" />
          <div className="h-px w-16 bg-brass" />
        </div>

        <p className="text-3xl text-offwhite font-serif">{data.subheading}</p>
        {showNavyHeading && <p className="text-brass-light text-lg font-serif mt-3">{navy250.heading}</p>}
        {navyLine && <p className="text-offwhite/70 text-xs uppercase tracking-[0.18em] mt-2">{navyLine}</p>}

        {navy250.countdownEnabled !== false && navy250.deadline && (
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

        {navy250.images.length > 0 && (
          <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3">
            {navy250.images.slice(0, 2).map((src) => (
              <div key={src} className="relative aspect-[16/9] overflow-hidden rounded-lg border border-brass/20 bg-navy-dark/60 shadow-lg">
                <ImageWithFallback src={src} alt="USS Omaha historical image" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="pt-8 animate-fade-in-delay">
          <div className="animate-bounce">
            <svg className="w-10 h-10 mx-auto text-brass opacity-90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
