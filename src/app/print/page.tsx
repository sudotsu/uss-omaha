import { Agenda } from '@/components/sections/Agenda'
import { Background } from '@/components/sections/Background'
import { Hero } from '@/components/sections/Hero'
import { Letters } from '@/components/sections/Letters'
import { Mission } from '@/components/sections/Mission'
import { SubmarineFacts } from '@/components/sections/SubmarineFacts'
import { loadContent } from '@/lib/content'

export default function PrintPage() {
  const content = loadContent()

  return (
    <main className="print-layout">
      <Hero data={content.hero} navy250={content.navy250} isPrint />
      <Mission data={content.mission} isPrint />

      <div className="page-break" />

      <Agenda data={content.agenda} isPrint />

      <div className="page-break" />

      <Background data={content.background} isPrint />

      <div className="page-break" />

      <Letters data={content.letters} isPrint />

      <div className="page-break" />

      <SubmarineFacts data={content.submarineFacts} isPrint />

      {/* Placeholder for upcoming sections */}
      <div className="page-break" />

      <section className="section-light py-12">
        <div className="content-container text-center">
          <p className="text-slate-deep text-sm italic">
            [Additional sections: Timeline, Phases, Budget, Location, Site Plan, Gallery, Execution Photos, Why Now, Call to Action, Volunteer, Stakeholders, Close]
          </p>
        </div>
      </section>
    </main>
  )
}
