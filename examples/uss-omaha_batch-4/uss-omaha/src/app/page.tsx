import { loadContent } from '@/lib/content'
import { Hero } from '@/components/sections/Hero'
import { Mission } from '@/components/sections/Mission'
import { Agenda } from '@/components/sections/Agenda'
import { Background } from '@/components/sections/Background'
import { Letters } from '@/components/sections/Letters'
import { SubmarineFacts } from '@/components/sections/SubmarineFacts'
import { Timeline } from '@/components/sections/Timeline'
import { Phases } from '@/components/sections/Phases'
import { WhatYourGiftBuilds } from '@/components/sections/WhatYourGiftBuilds'
import { Budget } from '@/components/sections/Budget'
import { LocationShift } from '@/components/sections/LocationShift'
import { SitePlan } from '@/components/sections/SitePlan'
import { Gallery } from '@/components/sections/Gallery'
import { ExecutionPhotos } from '@/components/sections/ExecutionPhotos'
import { WhyNow } from '@/components/sections/WhyNow'
import { CallToAction } from '@/components/sections/CallToAction'
import { Volunteer } from '@/components/sections/Volunteer'
import { Stakeholders } from '@/components/sections/Stakeholders'
import { Close } from '@/components/sections/Close'
import { PresentedBy } from '@/components/sections/PresentedBy'

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
      <WhatYourGiftBuilds phases={content.phases} />
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
    </main>
  )
}
