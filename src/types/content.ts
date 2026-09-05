import type { z } from 'zod'
import {
  agendaSchema,
  backgroundSchema,
  budgetSchema,
  callToActionSchema,
  closeSchema,
  contentSchema,
  executionPhotosSchema,
  footerSchema,
  fundraisingProgressSchema,
  gallerySchema,
  heroSchema,
  lettersSchema,
  locationShiftSchema,
  metadataSchema,
  missionSchema,
  navy250Schema,
  phasesSchema,
  presentedBySchema,
  sitePlanSchema,
  stakeholdersSchema,
  submarineFactsSchema,
  timelineSchema,
  volunteerSchema,
  whatYourGiftBuildsSchema,
  whyNowSchema,
} from '@/lib/content-schema'

export type ContentData = z.infer<typeof contentSchema>
export type Metadata = z.infer<typeof metadataSchema>
export type Hero = z.infer<typeof heroSchema>
export type Mission = z.infer<typeof missionSchema>
export type Agenda = z.infer<typeof agendaSchema>
export type AgendaItem = Agenda['items'][number]
export type Background = z.infer<typeof backgroundSchema>
export type Milestone = Background['milestones'][number]
export type Letters = z.infer<typeof lettersSchema>
export type LetterItem = Letters['items'][number]
export type SubmarineFacts = z.infer<typeof submarineFactsSchema>
export type Fact = SubmarineFacts['facts'][number]
export type Timeline = z.infer<typeof timelineSchema>
export type TimelineMilestone = Timeline['milestones'][number]
export type Phases = z.infer<typeof phasesSchema>
export type Phase = Phases['phaseList'][number]
export type WhatYourGiftBuilds = z.infer<typeof whatYourGiftBuildsSchema>
export type FundraisingProgress = z.infer<typeof fundraisingProgressSchema>
export type Budget = z.infer<typeof budgetSchema>
export type LocationShift = z.infer<typeof locationShiftSchema>
export type SitePlan = z.infer<typeof sitePlanSchema>
export type Gallery = z.infer<typeof gallerySchema>
export type GalleryImage = Gallery['images'][number]
export type ExecutionPhotos = z.infer<typeof executionPhotosSchema>
export type ExecutionPhoto = ExecutionPhotos['photos'][number]
export type WhyNow = z.infer<typeof whyNowSchema>
export type Project = WhyNow['projects'][number]
export type MemorialProject = WhyNow['memorial']
export type CallToActionSection = z.infer<typeof callToActionSchema>
export type CallToActionMode = CallToActionSection['memorial']
export type Organization = CallToActionMode['primaryOrg']
export type AlternateOrganization = CallToActionMode['alternateOrg']
export type MailingAddress = Organization['mailingAddress']
export type Volunteer = z.infer<typeof volunteerSchema>
export type Contact = NonNullable<Volunteer['contact']>
export type Stakeholders = z.infer<typeof stakeholdersSchema>
export type Member = Stakeholders['members'][number]
export type Close = z.infer<typeof closeSchema>
export type ContactInfo = Close['contactInfo']
export type PresentedBy = z.infer<typeof presentedBySchema>
export type Presenter = PresentedBy['presenters'][number]
export type Footer = z.infer<typeof footerSchema>
export type FooterContact = Footer['contact']
export type QuickLink = Footer['quickLinks'][number]
export type Logo = Footer['logos'][number]
export type Navy250 = z.infer<typeof navy250Schema>
