import { Agenda } from '@/components/sections/Agenda'
import { Background } from '@/components/sections/Background'
import { Budget } from '@/components/sections/Budget'
import { Hero } from '@/components/sections/Hero'
import { Letters } from '@/components/sections/Letters'
import { LocationShift } from '@/components/sections/LocationShift'
import { Mission } from '@/components/sections/Mission'
import { Phases } from '@/components/sections/Phases'
import { SubmarineFacts } from '@/components/sections/SubmarineFacts'
import { Timeline } from '@/components/sections/Timeline'
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
      <Timeline data={content.timeline} />
      <Phases data={content.phases} />
      <Budget data={content.budget} />
      <LocationShift data={content.locationShift} />
    </main>
  )
}
