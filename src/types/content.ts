export interface ContentData {
  metadata: Metadata
  hero: Hero
  mission: Mission
  agenda: Agenda
  background: Background
  letters: Letters
  submarineFacts: SubmarineFacts
  timeline: Timeline
  phases: Phases
  fundraisingProgress: FundraisingProgress
  budget: Budget
  locationShift: LocationShift
  sitePlan: SitePlan
  gallery: Gallery
  executionPhotos: ExecutionPhotos
  whyNow: WhyNow
  callToAction: CallToActionSection
  volunteer: Volunteer
  stakeholders: Stakeholders
  close: Close
  presentedBy: PresentedBy
  footer: Footer
  navy250: Navy250
}

export interface Metadata {
  title: string
  subtitle: string
  year: string
  mode: 'memorial' | 'donor'
}

export interface Hero {
  heading: string
  subheading: string
  backgroundImage: string
}

export interface Mission {
  heading: string
  statement: string
  highlights: string[]
}

export interface Agenda {
  heading: string
  items: AgendaItem[]
}

export interface AgendaItem {
  title: string
  description: string
}

export interface Background {
  heading: string
  paragraphs: string[]
  keyPoints: string[]
  milestones: Milestone[]
}

export interface Milestone {
  year: string
  month: string
  event: string
}

export interface Letters {
  heading: string
  description: string
  items: LetterItem[]
}

export interface LetterItem {
  title: string
  image: string
  excerpt: string
}

export interface SubmarineFacts {
  heading: string
  facts: Fact[]
  image: string
}

export interface Fact {
  label: string
  value: string
}

export interface Timeline {
  heading: string
  milestones: TimelineMilestone[]
}

export interface TimelineMilestone {
  date: string
  title: string
  details: string
}

export interface Phases {
  heading: string
  phaseList: Phase[]
}

export interface Phase {
  number: number
  title: string
  description: string
  status: string
  cost: string
  percentComplete: number
}

export interface FundraisingProgress {
  raised: number
  goal: number
  donorCount: number
  lastGiftTime: string
}

export interface Budget {
  heading: string
  totalRemaining: string
  note: string
}

export interface LocationShift {
  heading: string
  subtitle: string
  floodImage: string
  floodCaption: string
  newLocationHeading: string
  newLocationBody: string
  mapImage: string
}

export interface SitePlan {
  heading: string
  description: string
  detail: string
  renderImage: string
}

export interface Gallery {
  heading: string
  images: GalleryImage[]
}

export interface GalleryImage {
  src: string
  caption: string
}

export interface ExecutionPhotos {
  heading: string
  photos: ExecutionPhoto[]
}

export interface ExecutionPhoto {
  src: string
  caption: string
  year: string
}

export interface WhyNow {
  heading: string
  projects: Project[]
  memorial: MemorialProject
  tagline: string
}

export interface Project {
  name: string
  cost: string
}

export interface MemorialProject {
  name: string
  cost: string
}

export interface CallToActionSection {
  memorial: CallToActionMode
  donor: CallToActionMode
}

export interface CallToActionMode {
  heading: string
  tagline: string
  donationHeading: string
  primaryOrg: Organization
  alternateOrg: AlternateOrganization
  trustIndicators?: string[]
  taxNote: string
  pledgeFormText: string
  pledgeFormUrl: string
}

export interface Organization {
  name: string
  ein: string
  website: string
  email: string
  phone: string
  mailingAddress: MailingAddress
}

export interface AlternateOrganization {
  name: string
  ein: string
  note: string
}

export interface MailingAddress {
  attention: string
  address: string
  city: string
}

export interface Volunteer {
  heading: string
  subheading: string
  contact: Contact
  opportunities: string[]
  organization: string
  organizationContact: string
}

export interface Contact {
  name: string
  phone: string
  email: string
}

export interface Stakeholders {
  heading: string
  members: Member[]
}

export interface Member {
  name: string
  title: string
  subtitle?: string
}

export interface Close {
  heading: string
  subheading: string
  contactInfo: ContactInfo
  finalImage: string
}

export interface ContactInfo {
  organization: string
  website: string
  contact: string
}

export interface PresentedBy {
  heading: string
  presenters: Presenter[]
}

export interface Presenter {
  name: string
  org: string
  title: string
}

export interface Footer {
  address: string[]
  contact: FooterContact
  quickLinks: QuickLink[]
  logos: Logo[]
}

export interface FooterContact {
  name: string
  email: string
  phone: string
}

export interface QuickLink {
  label: string
  href: string
}

export interface Logo {
  src: string
  alt: string
}

export interface Navy250 {
  logo: string
  heading: string
  deadline?: string
  deadlineLabel?: string
  deadlineText?: string
  subheading: string
  subtitle: string
  images: string[]
}
