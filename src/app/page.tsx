import { Agenda } from '@/components/sections/Agenda'
import { Background } from '@/components/sections/Background'
import { Budget } from '@/components/sections/Budget'
import { CallToAction } from '@/components/sections/CallToAction'
import { Close } from '@/components/sections/Close'
import { ExecutionPhotos } from '@/components/sections/ExecutionPhotos'
import { Footer } from '@/components/sections/Footer'
import { FundraisingProgress } from '@/components/sections/FundraisingProgress'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { Letters } from '@/components/sections/Letters'
import { LocationShift } from '@/components/sections/LocationShift'
import { Mission } from '@/components/sections/Mission'
import { Phases } from '@/components/sections/Phases'
import { PresentedBy } from '@/components/sections/PresentedBy'
import { SitePlan } from '@/components/sections/SitePlan'
import { Stakeholders } from '@/components/sections/Stakeholders'
import { SubmarineFacts } from '@/components/sections/SubmarineFacts'
import { Timeline } from '@/components/sections/Timeline'
import { Volunteer } from '@/components/sections/Volunteer'
import { WhatYourGiftBuilds } from '@/components/sections/WhatYourGiftBuilds'
import { WhyNow } from '@/components/sections/WhyNow'
import { StickyNav } from '@/components/ui/StickyNav'
import { loadContent } from '@/lib/content'

export default function HomePage() {
  const content = loadContent()

  return (
    <main className="min-h-screen">
      <StickyNav
        sections={[
          { id: 'mission', label: 'Mission' },
          { id: 'phases', label: 'Phases' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'call-to-action', label: 'Donate', highlight: true }
        ]}
        pledgeFormUrl={content.callToAction.memorial.pledgeFormUrl}
      />

      <Hero data={content.hero} navy250={content.navy250} />
      <Mission data={content.mission} />
      <Agenda data={content.agenda} />
      <Background data={content.background} />
      <Letters data={content.letters} />
      <SubmarineFacts data={content.submarineFacts} />
      <Timeline data={content.timeline} />

      <Phases data={content.phases} />
      <WhatYourGiftBuilds phases={content.phases} />
      <FundraisingProgress data={content.fundraisingProgress} />
      <Budget data={content.budget} />

      <LocationShift data={content.locationShift} />
      <SitePlan data={content.sitePlan} />
      <Gallery data={content.gallery} />
      <ExecutionPhotos data={content.executionPhotos} />
      <WhyNow data={content.whyNow} />

      <CallToAction data={content.callToAction} mode={content.metadata.mode} />
      <Volunteer data={content.volunteer} />
      <Stakeholders data={content.stakeholders} />
      <Close data={content.close} />
      <PresentedBy data={content.presentedBy} />

      <Footer data={content.footer} />
    </main>
  )
}
