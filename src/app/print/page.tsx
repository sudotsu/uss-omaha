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
import { loadContent } from '@/lib/content'

export default function PrintPage() {
  const content = loadContent()

  return (
    <main className="print-layout">
      <Hero data={content.hero} navy250={content.navy250} isPrint />

      <div className="page-break" />

      <Mission data={content.mission} isPrint />
      <Agenda data={content.agenda} isPrint />

      <div className="page-break" />

      <Background data={content.background} isPrint />
      <Letters data={content.letters} isPrint />

      <div className="page-break" />

      <SubmarineFacts data={content.submarineFacts} isPrint />

      <div className="page-break" />

      <Timeline data={content.timeline} isPrint />

      <div className="page-break" />

      <Phases data={content.phases} isPrint />
      <WhatYourGiftBuilds phases={content.phases} isPrint />
      <FundraisingProgress data={content.fundraisingProgress} isPrint />
      <Budget data={content.budget} isPrint />

      <div className="page-break" />

      <LocationShift data={content.locationShift} isPrint />

      <div className="page-break" />

      <SitePlan data={content.sitePlan} isPrint />

      <div className="page-break" />

      <Gallery data={content.gallery} isPrint />
      <ExecutionPhotos data={content.executionPhotos} isPrint />

      <div className="page-break" />

      <WhyNow data={content.whyNow} isPrint />

      <div className="page-break" />

      <CallToAction data={content.callToAction} mode={content.metadata.mode} isPrint />
      <Volunteer data={content.volunteer} isPrint />
      <Stakeholders data={content.stakeholders} isPrint />
      <Close data={content.close} isPrint />
      <PresentedBy data={content.presentedBy} isPrint />

      <div className="page-break" />

      <Footer data={content.footer} isPrint />
    </main>
  )
}
