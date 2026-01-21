import { Agenda } from '@/components/sections/Agenda'
import { Background } from '@/components/sections/Background'
import { Hero } from '@/components/sections/Hero'
import { Letters } from '@/components/sections/Letters'
import { Mission } from '@/components/sections/Mission'
import { SubmarineFacts } from '@/components/sections/SubmarineFacts'
import { loadContent } from '@/lib/content'

export default function HomePage() {
  const content = loadContent()

  return (
    <main className="min-h-screen">
      <Hero data={content.hero} />
      <Mission data={content.mission} />
      <Agenda data={content.agenda} />
      <Background data={content.background} />
      <Letters data={content.letters} />
      <SubmarineFacts data={content.submarineFacts} />

      {/* Placeholder for upcoming sections */}
      <section className="section-slate section-spacing">
        <div className="content-container text-center">
          <p className="text-offwhite text-lg italic">
            Additional sections coming in Batch 3: Timeline, Phases, Budget, Location, Site Plan, Gallery, Execution Photos, Why Now, Call to Action, Volunteer, Stakeholders
          </p>
        </div>
      </section>
    </main>
  )
}
